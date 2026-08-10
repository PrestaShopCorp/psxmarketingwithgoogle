<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

final class Rfc3986UrlValidator
{
    private const MAX_URL_BYTES = 2000;
    private const URI_CHARACTERS_PATTERN = '/\A(?:[A-Za-z0-9._~:\/?#\[\]@!$&\'()*+,;=-]|%[0-9A-Fa-f]{2})+\z/D';

    public static function isValidHttpUrl(string $url): bool
    {
        if ('' === $url
            || self::MAX_URL_BYTES < strlen($url)
            || 1 !== preg_match(self::URI_CHARACTERS_PATTERN, $url)
            || false === filter_var($url, FILTER_VALIDATE_URL)
        ) {
            return false;
        }

        $parts = parse_url($url);

        return is_array($parts)
            && isset($parts['scheme'], $parts['host'])
            && in_array(strtolower($parts['scheme']), ['http', 'https'], true)
            && '' !== $parts['host']
            && !isset($parts['user'])
            && !isset($parts['pass']);
    }
}
