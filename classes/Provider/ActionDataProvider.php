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

use Context;
use Currency;
use Order;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\DTO\Remarketing\ActionData;

class ActionDataProvider
{
    /**
     * @var Context
     */
    protected $context;

    /**
     * @var ConfigurationAdapter
     */
    private $configurationAdapter;

    public function __construct(Context $context, ConfigurationAdapter $configurationAdapter)
    {
        $this->context = $context;
        $this->configurationAdapter = $configurationAdapter;
    }

    public function getActionDataByOrderObject(Order $order): ActionData
    {
        $actionData = new ActionData();

        $actionData->setDiscount((string) $order->total_discounts_tax_incl);
        $actionData->setAwMerchandId((int) $this->configurationAdapter->get(Config::MERCHANT_GMC_ID));
        $actionData->setAwFeedCountry($this->configurationAdapter->get(Config::MERCHANT_GMC_FEED_COUNTRY));
        $actionData->setAwFeedLanguage($this->configurationAdapter->get(Config::MERCHANT_GMC_FEED_LANGUAGE));

        return $actionData;
    }
}
