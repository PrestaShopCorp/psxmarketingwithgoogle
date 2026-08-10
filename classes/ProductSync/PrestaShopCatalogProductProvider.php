<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;

final class PrestaShopCatalogProductProvider implements CatalogProductProviderInterface
{
    private const SENSITIVE_QUERY_KEYS = [
        'access_token',
        'adtoken',
        'client_secret',
        'code',
        'id_employee',
        'preview',
        'refresh_token',
        'secret',
        'token',
    ];

    /** @var PrestaShopCatalogGatewayInterface */
    private $gateway;

    public function __construct(PrestaShopCatalogGatewayInterface $gateway)
    {
        $this->gateway = $gateway;
    }

    public function assertContext(int $shopId, int $languageId): void
    {
        $context = $this->trustedContext();
        if ($shopId !== $context['shopId'] || $languageId !== $context['languageId']) {
            throw new InvalidArgumentException('Catalog context is not trusted.');
        }
    }

    public function combinationCounts(int $productId, int $shopId): array
    {
        return $this->gateway->combinationCounts($productId, $shopId);
    }

    public function activeCombinationIds(
        int $productId,
        int $shopId,
        int $languageId,
        int $offset,
        int $limit
    ): array {
        return $this->gateway->activeCombinationIds($productId, $shopId, $languageId, $offset, $limit);
    }

    public function product(int $productId, int $attributeId, int $shopId, int $languageId): CatalogProduct
    {
        $this->assertContext($shopId, $languageId);
        $data = $this->gateway->offer($productId, $attributeId, $shopId, $languageId);
        if (!$this->validOfferData($data)) {
            throw new ProductValidationException([['field' => 'product', 'code' => 'invalid_catalog_data']]);
        }

        $context = $this->trustedContext();
        $link = $this->canonicalUrl($data['link'], $context, false);
        $imageLink = $this->canonicalUrl($data['imageLink'], $context, true);
        $errors = [];
        if (null === $link) {
            $errors[] = ['field' => 'link', 'code' => 'invalid_url'];
        }
        if (null === $imageLink) {
            $errors[] = ['field' => 'imageLink', 'code' => 'invalid_url'];
        }
        if ([] !== $errors) {
            throw new ProductValidationException($errors);
        }

        return new CatalogProduct(
            $productId . '-' . $attributeId,
            $data['title'],
            $data['description'],
            $link,
            $imageLink,
            $data['inStock'],
            $data['price'],
            $data['currency'],
            $data['brand'],
            $data['gtin'],
            $data['mpn']
        );
    }

    /**
     * @return array{shopId: int, languageId: int, trustedBaseUrl: string, trustedMediaHosts: string[]}
     */
    private function trustedContext(): array
    {
        $context = $this->gateway->context();
        if (!isset($context['shopId'], $context['languageId'], $context['trustedBaseUrl'], $context['trustedMediaHosts'])
            || !is_int($context['shopId'])
            || 0 >= $context['shopId']
            || !is_int($context['languageId'])
            || 0 >= $context['languageId']
            || !is_string($context['trustedBaseUrl'])
            || !is_array($context['trustedMediaHosts'])
            || !$this->isTrustedBaseUrl($context['trustedBaseUrl'])
        ) {
            throw new InvalidArgumentException('Catalog context is not trusted.');
        }
        foreach ($context['trustedMediaHosts'] as $host) {
            if (!is_string($host) || !$this->isHost($host)) {
                throw new InvalidArgumentException('Catalog context is not trusted.');
            }
        }

        return $context;
    }

    /** @param array<string, mixed> $data */
    private function validOfferData(array $data): bool
    {
        foreach (['title', 'description', 'link', 'imageLink', 'price', 'currency'] as $field) {
            if (!array_key_exists($field, $data) || !is_string($data[$field])) {
                return false;
            }
        }
        if (!array_key_exists('inStock', $data) || !is_bool($data['inStock'])) {
            return false;
        }
        foreach (['brand', 'gtin', 'mpn'] as $field) {
            if (!array_key_exists($field, $data) || (null !== $data[$field] && !is_string($data[$field]))) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param array{shopId: int, languageId: int, trustedBaseUrl: string, trustedMediaHosts: string[]} $context
     */
    private function canonicalUrl(string $url, array $context, bool $allowMediaHost): ?string
    {
        if ('' === $url || $this->containsControl($url)) {
            return null;
        }
        $base = parse_url($context['trustedBaseUrl']);
        if (!is_array($base) || !isset($base['host'])) {
            return null;
        }

        if (0 === strpos($url, '//')) {
            $url = 'https:' . $url;
        } elseif (1 !== preg_match('#^https?://#i', $url)) {
            if (0 === strpos($url, '/')) {
                $url = 'https://' . strtolower($base['host']) . $this->port($base) . $url;
            } else {
                if (false !== strpos($url, '..')) {
                    return null;
                }
                $url = rtrim($context['trustedBaseUrl'], '/') . '/' . ltrim($url, '/');
            }
        }

        $parts = parse_url($url);
        if (!is_array($parts)
            || !isset($parts['scheme'], $parts['host'])
            || !in_array(strtolower($parts['scheme']), ['http', 'https'], true)
            || isset($parts['user'])
            || isset($parts['pass'])
        ) {
            return null;
        }
        $host = strtolower($parts['host']);
        $allowedHosts = [strtolower($base['host'])];
        if ($allowMediaHost) {
            $allowedHosts = array_merge($allowedHosts, array_map('strtolower', $context['trustedMediaHosts']));
        }
        if (!in_array($host, $allowedHosts, true)) {
            return null;
        }
        if ($host === strtolower($base['host']) && $this->port($parts) !== $this->port($base)) {
            return null;
        }

        $canonical = 'https://' . $host . $this->port($parts) . ($parts['path'] ?? '/');
        $query = isset($parts['query']) ? $this->safeQuery($parts['query']) : '';
        if ('' !== $query) {
            $canonical .= '?' . $query;
        }
        if (isset($parts['fragment']) && '' !== $parts['fragment']) {
            $canonical .= '#' . $parts['fragment'];
        }

        return false !== filter_var($canonical, FILTER_VALIDATE_URL) ? $canonical : null;
    }

    private function safeQuery(string $query): string
    {
        $safe = [];
        foreach (explode('&', $query) as $part) {
            if ('' === $part) {
                continue;
            }
            $separator = strpos($part, '=');
            $encodedKey = false === $separator ? $part : substr($part, 0, $separator);
            $key = strtolower(rawurldecode($encodedKey));
            if (!in_array($key, self::SENSITIVE_QUERY_KEYS, true)) {
                $safe[] = $part;
            }
        }

        return implode('&', $safe);
    }

    /** @param array<string, mixed> $parts */
    private function port(array $parts): string
    {
        return isset($parts['port']) ? ':' . (int) $parts['port'] : '';
    }

    private function isTrustedBaseUrl(string $url): bool
    {
        if ($this->containsControl($url) || false === filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }
        $parts = parse_url($url);

        return is_array($parts)
            && isset($parts['scheme'], $parts['host'])
            && 'https' === strtolower($parts['scheme'])
            && !isset($parts['user'])
            && !isset($parts['pass']);
    }

    private function isHost(string $host): bool
    {
        return 1 === preg_match('/^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)(?:\.(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?))*$/D', $host);
    }

    private function containsControl(string $value): bool
    {
        return 1 === preg_match('/[\x00-\x1F\x7F]/', $value);
    }
}
