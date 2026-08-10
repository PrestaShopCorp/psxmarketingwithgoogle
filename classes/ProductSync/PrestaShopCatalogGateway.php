<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;
use Throwable;

final class PrestaShopCatalogGateway implements PrestaShopCatalogGatewayInterface
{
    private const MAX_PAGE_SIZE = 250;

    /** @var object */
    private $context;

    /** @var object */
    private $link;

    /** @var object */
    private $db;

    /** @var PrestaShopProductRuntimeInterface */
    private $runtime;

    /** @var string */
    private $dbPrefix;

    /**
     * Core classes are intentionally accepted through this narrow runtime seam so catalog paging is testable without
     * booting or mutating PrestaShop's global Context.
     *
     * @param mixed $context
     * @param mixed $link
     * @param mixed $db
     */
    public function __construct(
        $context,
        $link,
        $db,
        PrestaShopProductRuntimeInterface $runtime,
        ?string $dbPrefix = null
    ) {
        $prefix = null === $dbPrefix && defined('_DB_PREFIX_') ? (string) constant('_DB_PREFIX_') : $dbPrefix;
        if (!is_object($context)
            || !is_object($link)
            || !is_object($db)
            || !is_string($prefix)
            || 1 !== preg_match('/^[A-Za-z0-9_]*$/D', $prefix)
        ) {
            throw new InvalidArgumentException('PrestaShop catalog dependencies are invalid.');
        }
        $this->context = $context;
        $this->link = $link;
        $this->db = $db;
        $this->runtime = $runtime;
        $this->dbPrefix = $prefix;
    }

    public function context(): array
    {
        if (!isset(
            $this->context->shop,
            $this->context->shop->id,
            $this->context->shop->domain_ssl,
            $this->context->language,
            $this->context->language->id,
            $this->context->currency,
            $this->context->currency->iso_code
        )) {
            throw new InvalidArgumentException('Active PrestaShop catalog context is invalid.');
        }
        $authority = $this->normalizedShopAuthority((string) $this->context->shop->domain_ssl);
        if (null === $authority) {
            throw new InvalidArgumentException('Active PrestaShop catalog context is invalid.');
        }
        $basePath = '/' . trim(
            (string) ($this->context->shop->physical_uri ?? '')
            . (string) ($this->context->shop->virtual_uri ?? ''),
            '/'
        ) . '/';
        if ('//' === $basePath) {
            $basePath = '/';
        }

        return [
            'shopId' => (int) $this->context->shop->id,
            'languageId' => (int) $this->context->language->id,
            'trustedBaseUrl' => 'https://' . $authority . $basePath,
            'trustedMediaHosts' => $this->configuredMediaHosts(),
        ];
    }

    public function combinationCounts(int $productId, int $shopId): array
    {
        $this->assertRequestedContext($shopId, (int) $this->context->language->id);
        $this->assertPositiveId($productId);
        $sql = 'SELECT COUNT(DISTINCT pa.`id_product_attribute`) '
            . 'FROM `' . $this->dbPrefix . 'product_attribute` pa '
            . 'INNER JOIN `' . $this->dbPrefix . 'product_attribute_shop` pas '
            . 'ON pas.`id_product_attribute` = pa.`id_product_attribute` AND pas.`id_shop` = ' . $shopId . ' '
            . 'INNER JOIN `' . $this->dbPrefix . 'product_shop` ps '
            . 'ON ps.`id_product` = pa.`id_product` AND ps.`id_shop` = ' . $shopId . ' AND ps.`active` = 1 '
            . 'WHERE pa.`id_product` = ' . $productId;
        $count = $this->db->getValue($sql);
        if (!is_int($count) && (!is_string($count) || 1 !== preg_match('/^[0-9]+$/D', $count))) {
            throw new ProductValidationException([['field' => 'product', 'code' => 'invalid_catalog_data']]);
        }
        $count = (int) $count;

        // PrestaShop combinations do not have a separate active flag. A shop association under an active product is active.
        return ['total' => $count, 'active' => $count];
    }

    public function activeCombinationIds(
        int $productId,
        int $shopId,
        int $languageId,
        int $offset,
        int $limit
    ): array {
        $this->assertRequestedContext($shopId, $languageId);
        $this->assertPositiveId($productId);
        if (0 > $offset || 0 >= $limit || self::MAX_PAGE_SIZE < $limit) {
            throw new InvalidArgumentException('Combination pagination is invalid.');
        }
        $sql = 'SELECT DISTINCT pa.`id_product_attribute` '
            . 'FROM `' . $this->dbPrefix . 'product_attribute` pa '
            . 'INNER JOIN `' . $this->dbPrefix . 'product_attribute_shop` pas '
            . 'ON pas.`id_product_attribute` = pa.`id_product_attribute` AND pas.`id_shop` = ' . $shopId . ' '
            . 'INNER JOIN `' . $this->dbPrefix . 'product_shop` ps '
            . 'ON ps.`id_product` = pa.`id_product` AND ps.`id_shop` = ' . $shopId . ' AND ps.`active` = 1 '
            . 'WHERE pa.`id_product` = ' . $productId . ' '
            . 'ORDER BY pa.`id_product_attribute` ASC '
            . 'LIMIT ' . $offset . ', ' . $limit;
        $rows = $this->db->executeS($sql);
        if (!is_array($rows)) {
            throw new ProductValidationException([['field' => 'product', 'code' => 'invalid_catalog_data']]);
        }
        $ids = [];
        foreach ($rows as $row) {
            $raw = is_array($row) ? ($row['id_product_attribute'] ?? null) : null;
            if ((!is_int($raw) && (!is_string($raw) || 1 !== preg_match('/^[0-9]+$/D', $raw))) || 0 >= (int) $raw) {
                throw new ProductValidationException([['field' => 'product', 'code' => 'invalid_catalog_data']]);
            }
            $ids[] = (int) $raw;
        }

        return $ids;
    }

    public function offer(int $productId, int $attributeId, int $shopId, int $languageId): array
    {
        $this->assertRequestedContext($shopId, $languageId);
        $this->assertPositiveId($productId);
        if (0 > $attributeId) {
            throw new InvalidArgumentException('Product attribute ID is invalid.');
        }

        try {
            $product = $this->runtime->product($productId, $languageId, $shopId, $this->context);
            if ((int) $product->id !== $productId || !(bool) $product->active) {
                throw new ProductValidationException([['field' => 'product', 'code' => 'invalid_catalog_data']]);
            }
            $combination = null;
            if (0 !== $attributeId) {
                $combination = $this->runtime->combination($attributeId, $languageId, $shopId);
                if ((int) $combination->id !== $attributeId || (int) $combination->id_product !== $productId) {
                    throw new ProductValidationException([['field' => 'product', 'code' => 'invalid_catalog_data']]);
                }
            }

            $link = $this->link->getProductLink(
                $product,
                null,
                null,
                null,
                $languageId,
                $shopId,
                $attributeId,
                false,
                false,
                true,
                ['preview' => ''],
                true
            );
            $imageId = $this->imageId($productId, $attributeId, $shopId);
            $imageLink = null === $imageId
                ? ''
                : $this->link->getImageLink($this->localized($product->link_rewrite, $languageId), $imageId, 'large_default');
            $price = $this->runtime->price($productId, $attributeId, $this->context);
            $gtin = $this->firstNonEmpty([
                null === $combination ? null : $combination->ean13,
                null === $combination ? null : $combination->upc,
                $product->ean13,
                $product->upc,
            ]);
            $mpn = $this->firstNonEmpty([
                null === $combination ? null : $combination->mpn,
                $product->mpn,
            ]);
            $brand = $this->runtime->manufacturerName((int) ($product->id_manufacturer ?? 0));

            return [
                'title' => $this->localized($product->name, $languageId),
                'description' => $this->localized($product->description, $languageId),
                'link' => is_string($link) ? $link : '',
                'imageLink' => is_string($imageLink) ? $imageLink : '',
                'inStock' => 0 < $this->runtime->quantity($productId, $attributeId, $shopId),
                'price' => null === $price ? '' : $this->decimalPrice((float) $price),
                'currency' => (string) $this->context->currency->iso_code,
                'brand' => $this->nullableString($brand),
                'gtin' => $gtin,
                'mpn' => $mpn,
            ];
        } catch (ProductValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            unset($exception);

            throw new ProductValidationException([['field' => 'product', 'code' => 'invalid_catalog_data']]);
        }
    }

    private function imageId(int $productId, int $attributeId, int $shopId): ?int
    {
        if (0 !== $attributeId) {
            $sql = 'SELECT i.`id_image` FROM `' . $this->dbPrefix . 'product_attribute_image` pai '
                . 'INNER JOIN `' . $this->dbPrefix . 'image` i ON i.`id_image` = pai.`id_image` '
                . 'INNER JOIN `' . $this->dbPrefix . 'image_shop` image_shop '
                . 'ON image_shop.`id_image` = i.`id_image` AND image_shop.`id_shop` = ' . $shopId . ' '
                . 'WHERE pai.`id_product_attribute` = ' . $attributeId . ' AND i.`id_product` = ' . $productId . ' '
                . 'ORDER BY i.`position` ASC LIMIT 1';
            $image = $this->db->getValue($sql);
            if ((is_int($image) || (is_string($image) && 1 === preg_match('/^[0-9]+$/D', $image))) && 0 < (int) $image) {
                return (int) $image;
            }
        }

        return $this->runtime->coverImageId($productId, $this->context);
    }

    private function assertRequestedContext(int $shopId, int $languageId): void
    {
        $context = $this->context();
        if ($shopId !== $context['shopId'] || $languageId !== $context['languageId']) {
            throw new InvalidArgumentException('Catalog context is not trusted.');
        }
    }

    private function assertPositiveId(int $id): void
    {
        if (0 >= $id) {
            throw new InvalidArgumentException('Catalog identifier is invalid.');
        }
    }

    /** @param mixed $value */
    private function localized($value, int $languageId): string
    {
        if (is_string($value)) {
            return $value;
        }

        return is_array($value) && isset($value[$languageId]) && is_string($value[$languageId])
            ? $value[$languageId]
            : '';
    }

    /** @param mixed[] $values */
    private function firstNonEmpty(array $values): ?string
    {
        foreach ($values as $value) {
            if (is_string($value) && '' !== trim($value)) {
                return $value;
            }
        }

        return null;
    }

    /** @param mixed $value */
    private function nullableString($value): ?string
    {
        return is_string($value) && '' !== trim($value) ? $value : null;
    }

    private function decimalPrice(float $price): string
    {
        $decimal = rtrim(rtrim(number_format($price, 6, '.', ''), '0'), '.');

        return '' === $decimal || '-0' === $decimal ? '0' : $decimal;
    }

    /** @return string[] */
    private function configuredMediaHosts(): array
    {
        if (!class_exists('Configuration')) {
            return [];
        }
        $hosts = [];
        foreach (['PS_MEDIA_SERVER_1', 'PS_MEDIA_SERVER_2', 'PS_MEDIA_SERVER_3'] as $key) {
            $value = \Configuration::get($key);
            if (!is_string($value) || '' === trim($value)) {
                continue;
            }
            $value = trim($value);
            if (false !== strpos($value, '://')) {
                $parsed = parse_url($value);
                $value = is_array($parsed) && isset($parsed['host']) ? $parsed['host'] : '';
            }
            $value = strtolower($value);
            if ($this->validDomain($value) && !in_array($value, $hosts, true)) {
                $hosts[] = $value;
            }
        }

        return $hosts;
    }

    private function validDomain(string $domain): bool
    {
        return 1 === preg_match('/^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)(?:\.(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?))*$/D', $domain);
    }

    private function normalizedShopAuthority(string $authority): ?string
    {
        if ('' === $authority
            || 1 === preg_match('/[\x00-\x20\x7F]/', $authority)
            || false !== strpos($authority, '\\')
        ) {
            return null;
        }
        $parts = parse_url('https://' . $authority);
        if (!is_array($parts)
            || !isset($parts['host'])
            || isset($parts['user'])
            || isset($parts['pass'])
            || isset($parts['path'])
            || isset($parts['query'])
            || isset($parts['fragment'])
        ) {
            return null;
        }
        $host = strtolower($parts['host']);
        $unwrappedHost = '[' === ($host[0] ?? '') && ']' === substr($host, -1)
            ? substr($host, 1, -1)
            : $host;
        if (!$this->validDomain($host) && false === filter_var($unwrappedHost, FILTER_VALIDATE_IP)) {
            return null;
        }
        if (isset($parts['port']) && !$this->validPort($parts['port'])) {
            return null;
        }

        return $host . (isset($parts['port']) ? ':' . $parts['port'] : '');
    }

    /** @param mixed $port */
    private function validPort($port): bool
    {
        return is_int($port) && 0 < $port && 65535 >= $port;
    }
}
