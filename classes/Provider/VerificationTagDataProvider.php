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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Provider;

use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\VerificationTagRepository;

class VerificationTagDataProvider
{
    /**
     * @var ConfigurationAdapter
     */
    private $configurationAdapter;

    /**
     * @var VerificationTagRepository
     */
    private $verificationTagRepository;

    public function __construct(
        ConfigurationAdapter $configurationAdapter,
        VerificationTagRepository $verificationTagRepository
    ) {
        $this->configurationAdapter = $configurationAdapter;
        $this->verificationTagRepository = $verificationTagRepository;
    }

    public function isUpdateRequested(): bool
    {
        // If GMC account is not onboarded, do nothing.
        if (empty($this->configurationAdapter->get(Config::REMARKETING_CONVERSION_MERCHANT_GMC_ID))) {
            return false;
        }

        $configuration = $this->verificationTagRepository->getConfiguration();

        return !$configuration || (
            (new DateTimeImmutable($configuration['date_upd'], new DateTimeZone('UTC'))) <
            (new DateTimeImmutable('now', new DateTimeZone('UTC')))->sub(new DateInterval('P30D'))
        );
    }
}
