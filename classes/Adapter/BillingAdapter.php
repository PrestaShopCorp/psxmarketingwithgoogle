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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Adapter;

use PrestaShop\Module\PsxMarketingWithGoogle\Http\HttpClient;

class BillingAdapter
{
    private const BILLING_URL = 'https://billing-api.distribution.prestashop.net/v1/';
    private const BILLING_PREPROD_URL = 'https://billing-api.distribution-preprod.prestashop.net/v1/';

    /**
     * @var string
     */
    private $jwt;

    /**
     * @var string
     */
    private $url;

    /**
     * @var bool
     */
    private $isSandbox;

    public function __construct($jwt, $isSandbox, $usePreprod)
    {
        $this->jwt = $jwt;
        $this->isSandbox = $isSandbox;
        $this->url = $usePreprod ? self::BILLING_PREPROD_URL : self::BILLING_URL;
    }

    public function getCurrentSubscription($shopId, $productId)
    {
        $httpClient = new HttpClient($this->url);
        $headers = [
            'Accept: application/json',
            'Authorization: Bearer ' . $this->jwt,
            'Content-Type: application/json',
            'User-Agent : module-lib-billing v3 (' . $productId . ')',
        ];

        if ($this->isSandbox === true) {
            $headers[] = 'sandbox: true';
        }

        $httpClient->setHeaders($headers);

        return $httpClient->get('/customers/' . $shopId . '/subscriptions/' . $productId);
    }
}
