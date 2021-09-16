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
use PrestaShop\Module\PsxMarketingWithGoogle\DTO\Remarketing\ActionData;

class ActionDataProvider
{
    /**
     * @var Context
     */
    protected $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    public function getActionDataByOrderObject(Order $order): ActionData
    {
        $actionData = new ActionData();

        $actionData->setId($order->id);
        $actionData->setAffiliation($this->context->shop->name);
        $actionData->setValue((string) $order->total_paid_tax_incl);
        $actionData->setTax((string) ($order->total_paid_tax_incl - $order->total_paid_tax_excl));
        $actionData->setShipping((string) $order->total_shipping);
        $actionData->setCurrency((new Currency($order->id_currency))->iso_code);

        return $actionData;
    }
}