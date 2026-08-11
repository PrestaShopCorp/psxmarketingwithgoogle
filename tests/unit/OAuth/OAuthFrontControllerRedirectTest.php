<?php

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\OAuth;

use PHPUnit\Framework\TestCase;

final class OAuthFrontControllerRedirectTest extends TestCase
{
    public function testBackOfficeResultUsesFrontControllerSafeRedirect(): void
    {
        $worker = __DIR__ . '/fixtures/oauth-front-redirect-worker.php';
        $command = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($worker);
        $output = [];
        $status = 0;

        exec($command, $output, $status);

        self::assertSame(0, $status, implode("\n", $output));
        self::assertSame(
            '{"method":"redirect","url":"https://shop.example/admin/module?oauth_result=failed"}',
            end($output)
        );
    }
}
