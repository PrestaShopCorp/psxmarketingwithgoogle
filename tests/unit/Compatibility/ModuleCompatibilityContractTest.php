<?php

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Compatibility;

use PHPUnit\Framework\TestCase;

final class ModuleCompatibilityContractTest extends TestCase
{
    public function testReleaseMetadataSupportsPrestaShop827AndUsesVersion201(): void
    {
        $root = dirname(__DIR__, 3);
        require_once $root . '/psxmarketingwithgoogle.php';

        $module = new \PsxMarketingWithGoogle();

        self::assertSame('2.0.1', $module->version);
        self::assertSame(
            ['min' => '8.2.7', 'max' => _PS_VERSION_],
            $module->ps_versions_compliancy
        );

        $config = simplexml_load_file($root . '/config.xml');
        self::assertNotFalse($config);
        self::assertSame('2.0.1', (string) $config->version);
    }
}
