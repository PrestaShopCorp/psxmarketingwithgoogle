<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License version 3.0
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace Provider;

use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Provider\VerificationTagDataProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\VerificationTagRepository;

class VerificationTagDataProviderTest extends TestCase
{
    public function testUpdateIsNotRequestedWhenGmcIsNotConnected()
    {
        $stubConfigurationAdapter = $this->createStub(ConfigurationAdapter::class);
        $stubVerificationTagRepository = $this->createStub(VerificationTagRepository::class);

        $stubConfigurationAdapter->method('get')
                ->willReturn(null);

        $provider = new VerificationTagDataProvider(
            $stubConfigurationAdapter,
            $stubVerificationTagRepository
        );
        $result = $provider->isUpdateRequested();
        $this->assertFalse($result);
    }

    public function testUpdateIsRequested()
    {
        $stubConfigurationAdapter = $this->createStub(ConfigurationAdapter::class);
        $stubVerificationTagRepository = $this->createStub(VerificationTagRepository::class);

        $stubConfigurationAdapter->method('get')
                ->willReturn('1234567891');

        $stubVerificationTagRepository->method('getConfiguration')
                ->willReturn([
                    "value" => base64_encode('some verification tag'),
                    "date_upd" => "2023-01-02 15:16:31",
                ]);

        $provider = new VerificationTagDataProvider(
            $stubConfigurationAdapter,
            $stubVerificationTagRepository
        );
        $result = $provider->isUpdateRequested();
        $this->assertTrue($result);
    }

    public function testUpdateIsNotRequested()
    {
        $stubConfigurationAdapter = $this->createStub(ConfigurationAdapter::class);
        $stubVerificationTagRepository = $this->createStub(VerificationTagRepository::class);

        $stubConfigurationAdapter->method('get')
                ->willReturn('1234567891');

        $stubVerificationTagRepository->method('getConfiguration')
                ->willReturn([
                    "value" => base64_encode('some verification tag'),
                    "date_upd" => (new DateTimeImmutable('now', new DateTimeZone('UTC')))->sub(new DateInterval('P2D'))->format('Y-m-d H:i:s'),
                ]);

        $provider = new VerificationTagDataProvider(
            $stubConfigurationAdapter,
            $stubVerificationTagRepository
        );
        $result = $provider->isUpdateRequested();
        $this->assertFalse($result);
    }
}