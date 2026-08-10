<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;
use LogicException;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator;

final class CatalogProductSource
{
    private const MAX_PAGE_SIZE = 250;

    /** @var ProductEnumerator */
    private $productEnumerator;

    /** @var CatalogProductProviderInterface */
    private $provider;

    /** @var CatalogFilterSettingsInterface */
    private $filterSettings;

    public function __construct(
        ProductEnumerator $productEnumerator,
        CatalogProductProviderInterface $provider,
        CatalogFilterSettingsInterface $filterSettings
    ) {
        $this->productEnumerator = $productEnumerator;
        $this->provider = $provider;
        $this->filterSettings = $filterSettings;
    }

    /** @return CatalogProduct[] */
    public function page(int $shopId, int $languageId, int $offset, int $limit): array
    {
        $this->validatePage($shopId, $languageId, $offset, $limit);
        $this->provider->assertContext($shopId, $languageId);

        $filters = $this->filterSettings->filtersForShop($shopId);
        $rows = $this->productEnumerator->listProductOffersMatchingFilters($filters, [
            'offset' => $offset,
            'limit' => $limit,
            'orderBy' => 'id_product',
            'orderWay' => 'ASC',
        ]);
        if (count($rows) > $limit) {
            throw new LogicException('Offer enumeration returned an oversized page.');
        }

        $products = [];
        $previousProductId = 0;
        $previousAttributeId = -1;
        foreach ($rows as $row) {
            $productId = $this->positiveId($row, 'id_product');
            $attributeId = $this->nonNegativeId($row, 'id_product_attribute');
            if ($productId < $previousProductId
                || ($productId === $previousProductId && $attributeId <= $previousAttributeId)
            ) {
                throw new LogicException('Offer enumeration did not advance.');
            }
            $previousProductId = $productId;
            $previousAttributeId = $attributeId;

            $product = $this->provider->product($productId, $attributeId, $shopId, $languageId);
            if ($productId . '-' . $attributeId !== $product->offerId()) {
                throw new LogicException('Catalog provider returned an unstable offer identity.');
            }
            $this->assertCatalogUrls($product);
            $products[] = $product;
        }

        return $products;
    }

    private function validatePage(int $shopId, int $languageId, int $offset, int $limit): void
    {
        if (0 >= $shopId || 0 >= $languageId || 0 > $offset || 0 >= $limit || self::MAX_PAGE_SIZE < $limit) {
            throw new InvalidArgumentException('Catalog page arguments are invalid.');
        }
    }

    /** @param array<string, mixed> $row */
    private function positiveId(array $row, string $field): int
    {
        $value = $this->integerId($row[$field] ?? null);
        if (null === $value || 0 >= $value) {
            throw new LogicException('Offer enumeration returned an invalid product ID.');
        }

        return $value;
    }

    /** @param array<string, mixed> $row */
    private function nonNegativeId(array $row, string $field): int
    {
        $value = $this->integerId($row[$field] ?? null);
        if (null === $value || 0 > $value) {
            throw new LogicException('Offer enumeration returned an invalid product attribute ID.');
        }

        return $value;
    }

    /** @param mixed $raw */
    private function integerId($raw): ?int
    {
        if (is_int($raw)) {
            return $raw;
        }
        if (!is_string($raw) || 1 !== preg_match('/^(?:0|[1-9][0-9]*)$/D', $raw)) {
            return null;
        }
        $normalized = ltrim($raw, '0');
        $normalized = '' === $normalized ? '0' : $normalized;
        $max = (string) PHP_INT_MAX;
        if (strlen($normalized) > strlen($max)
            || (strlen($normalized) === strlen($max) && strcmp($normalized, $max) > 0)
        ) {
            return null;
        }

        return (int) $normalized;
    }

    private function assertCatalogUrls(CatalogProduct $product): void
    {
        $errors = [];
        $this->validateUrl('link', $product->link(), $errors);
        $this->validateUrl('imageLink', $product->imageLink(), $errors);
        if ([] !== $errors) {
            throw new ProductValidationException($errors);
        }
    }

    /** @param array<int, array{field: string, code: string}> $errors */
    private function validateUrl(string $field, string $url, array &$errors): void
    {
        if ('' === trim($url)) {
            $errors[] = ['field' => $field, 'code' => 'required'];

            return;
        }
        if (!Rfc3986UrlValidator::isValidHttpUrl($url)) {
            $errors[] = ['field' => $field, 'code' => 'invalid_url'];
        }
    }
}
