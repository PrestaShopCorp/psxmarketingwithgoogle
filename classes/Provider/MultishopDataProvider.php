<?php

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
