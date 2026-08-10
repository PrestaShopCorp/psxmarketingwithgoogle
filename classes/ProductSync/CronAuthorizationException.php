<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use RuntimeException;

final class CronAuthorizationException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Cron request is forbidden.');
    }

    public function response(): Response
    {
        return new Response(403, '{"code":"forbidden"}', [
            'Content-Type' => 'application/json',
            'Cache-Control' => 'no-store',
        ]);
    }
}
