<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\OAuth;

use UnexpectedValueException;

final class GoogleOAuthRedirectUriResolver
{
    private const CALLBACK_PATH = 'module/tlgoogleshopping/oauth';

    /** @var callable|null */
    private $shopLoader;

    public function __construct(?callable $shopLoader = null)
    {
        $this->shopLoader = $shopLoader;
    }

    public function resolve(int $shopId): string
    {
        if (0 >= $shopId) {
            throw $this->unavailable();
        }

        $shop = null === $this->shopLoader
            ? $this->loadConfiguredShop($shopId)
            : call_user_func($this->shopLoader, $shopId);
        if (!is_array($shop)) {
            throw $this->unavailable();
        }

        $domain = $shop['domain_ssl'] ?? null;
        if (!is_string($domain) || !$this->isValidDomain($domain)) {
            throw $this->unavailable();
        }

        $physicalPath = $this->normalizeBasePath($shop['physical_uri'] ?? null);
        $virtualPath = $this->normalizeBasePath($shop['virtual_uri'] ?? null);
        $basePath = implode('/', array_filter(
            [$physicalPath, $virtualPath],
            static function (string $path): bool {
                return '' !== $path;
            }
        ));

        return 'https://' . strtolower($domain) . '/'
            . ('' === $basePath ? '' : $basePath . '/')
            . self::CALLBACK_PATH;
    }

    /** @return array{domain_ssl: mixed, physical_uri: mixed, virtual_uri: mixed} */
    private function loadConfiguredShop(int $shopId): array
    {
        $shop = new \Shop($shopId);
        if (!\Validate::isLoadedObject($shop)) {
            throw $this->unavailable();
        }

        return [
            'domain_ssl' => $shop->domain_ssl,
            'physical_uri' => $shop->physical_uri,
            'virtual_uri' => $shop->virtual_uri,
        ];
    }

    private function isValidDomain(string $domain): bool
    {
        if ($domain !== trim($domain) || 255 < strlen($domain)) {
            return false;
        }
        if (1 !== preg_match(
            '/^(?=.{1,255}$)(?:(?!-)[a-z0-9-]{1,63}(?<!-)\.)*(?!-)[a-z0-9-]{1,63}(?<!-)(?::([0-9]{1,5}))?$/iD',
            $domain,
            $matches
        )) {
            return false;
        }

        return !isset($matches[1]) || (0 < (int) $matches[1] && 65536 > (int) $matches[1]);
    }

    /** @param mixed $path */
    private function normalizeBasePath($path): string
    {
        if (!is_string($path) || 512 < strlen($path)
            || false !== strpbrk($path, "?#\\\0\r\n")
        ) {
            throw $this->unavailable();
        }

        $segments = preg_split('#/+#', trim($path, '/'));
        if (false === $segments) {
            throw $this->unavailable();
        }

        $normalized = [];
        foreach ($segments as $segment) {
            if ('' === $segment) {
                continue;
            }
            $decoded = rawurldecode($segment);
            if ('.' === $decoded || '..' === $decoded
                || 1 !== preg_match('/^[a-z0-9._~-]+$/iD', $segment)
            ) {
                throw $this->unavailable();
            }
            $normalized[] = $segment;
        }

        return implode('/', $normalized);
    }

    private function unavailable(): UnexpectedValueException
    {
        return new UnexpectedValueException('Google OAuth redirect URI is unavailable.');
    }
}
