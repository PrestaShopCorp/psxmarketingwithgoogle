<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Google;

use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;

interface GoogleTransportInterface
{
    /**
     * @param string[] $headers
     */
    public function request(string $method, string $url, array $headers, ?string $body): Response;
}
