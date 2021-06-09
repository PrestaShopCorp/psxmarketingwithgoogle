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

namespace PrestaShop\Module\PrestashopGoogleShopping\Provider;

use PrestaShop\Module\PrestashopGoogleShopping\Repository\ShopRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Tracker\Segment;
use Shop;

class MultishopDataProvider
{
    /**
     * @var ShopRepository
     */
    private $shopRepository;

    /**
     * @var Segment
     */
    private $segment;

    public function __construct(
        ShopRepository $shopRepository,
        Segment $segment
    ) {
        $this->shopRepository = $shopRepository;
        $this->segment = $segment;
    }

    /**
     * On a multishop context, several shop can have exactly the same domain.
     * PS Accounts provide one shop id per domain, which makes some conflict when
     * a different shops use the virtual directory.
     *
     * To revent this, we check if a shop is already onboarded with this domain and
     * warn the merchant accordingly.
     *
     * @param Shop $currentShop
     *
     * @return bool
     */
    public function isCurrentShopInConflict(Shop $currentShop)
    {
        $configurationData = $this->shopRepository->getShopDomainsAndConfiguration();

        foreach ($configurationData as $shopData) {
            if ((int) $shopData['id_shop'] === (int) $currentShop->id) {
                continue;
            }

            if (empty($shopData['acces_token_value'])) {
                continue;
            }

            if ($currentShop->domain !== $shopData['domain']
                && $currentShop->domain_ssl !== $shopData['domain_ssl']) {
                continue;
            }

            $this->segment->setMessage('Error: Multistore with same domain detected');
            $this->segment->track();

            return true;
        }

        return false;
    }
}
