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
use PrestaShop\Module\PsxMarketingWithGoogle\DTO\ConversionEventData;

class PageViewEventDataProvider
{
    /**
     * @var Context
     */
    protected $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    /**
     * Return the items concerned by the transaction
     * https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#action-data
     *
     * @return ConversionEventData|null
     */
    public function getEventData($sendTo)
    {
        if ($this->context->controller instanceof \ProductControllerCore) {
            /** @var \ProductControllerCore $controller */
            $controller = $this->context->controller;
            $product = $controller->getTemplateVarProduct();

            return (new ConversionEventData())
                ->setSendTo($sendTo)
                ->setCurrency($this->context->currency->iso_code)
                ->setValue((string) $product['price_amount']);
        }

        return null;
    }
}
