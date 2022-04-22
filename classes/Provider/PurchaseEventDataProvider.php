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
use Order;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\DTO\Remarketing\PurchaseEventData;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CountryRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\LanguageRepository;

class PurchaseEventDataProvider
{
    /**
     * @var ProductDataProvider
     */
    protected $productDataProvider;

    /**
     * @var Context
     */
    protected $context;

    /**
     * @var ConfigurationAdapter
     */
    private $configurationAdapter;

    /**
     * @var LanguageRepository
     */
    private $languageRepository;

    /**
     * @var CountryRepository
     */
    private $countryRepository;

    public function __construct(
        ProductDataProvider $productDataProvider,
        Context $context,
        ConfigurationAdapter $configurationAdapter,
        LanguageRepository $languageRepository,
        CountryRepository $countryRepository
    ) {
        $this->productDataProvider = $productDataProvider;
        $this->context = $context;
        $this->configurationAdapter = $configurationAdapter;
        $this->languageRepository = $languageRepository;
        $this->countryRepository = $countryRepository;
    }

    /**
     * Return the items concerned by the transaction
     *
     * @see https://support.google.com/google-ads/answer/9028614
     */
    public function getEventData($sendTo, Order $order): PurchaseEventData
    {
        $purchaseData = new PurchaseEventData();
        // Common details
        $purchaseData->setSendTo($sendTo);
        $purchaseData->setCurrency($this->context->currency->iso_code);
        $purchaseData->setValue((string) $order->total_products_wt);
        $purchaseData->setTransactionId($order->reference);

        // CwCD Parameters
        $purchaseData->setDiscount((float) $order->total_discounts_tax_incl);
        $purchaseData->setAwMerchandId((int) $this->configurationAdapter->get(Config::REMARKETING_CONVERSION_MERCHANT_GMC_ID));
        $purchaseData->setAwFeedCountry(
            $this->countryRepository->getIsoById(
                $this->context->country->id
            )
        );
        $purchaseData->setAwFeedLanguage(
            $this->languageRepository->getIsoById(
                $this->context->language->id
            )
        );

        $items = [];
        foreach ($order->getCartProducts() as $product) {
            $items[] = $this->productDataProvider->getProductDataByProductArray($product);
        }

        $purchaseData->setItems($items);

        return $purchaseData;
    }
}
