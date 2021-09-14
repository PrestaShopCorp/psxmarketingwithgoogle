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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Crawler;

class GoogleTagCrawler
{
    /**
     * html contents (front office)
     *
     * @var string|bool
     */
    private $contents;

    public function __construct(int $shopId)
    {
        $this->crawlFront($shopId);
    }

    /**
     * Check if the given tag already exist on the shop
     *
     * @param string $googleTag eg: AW-253749562
     *
     * @return bool
     */
    public function isGoogleTagAlreadyExist(string $googleTag): bool
    {
        if (false === $this->contents || empty($this->contents)) {
            return false;
        }

        return str_contains($this->contents, $googleTag);
    }

    /**
     * Find all google tag installed on the shop
     *
     * @return array all google tags present in the front
     */
    public function findAllGoogleTag(): array
    {
        if (false === $this->contents || empty($this->contents)) {
            return [];
        }

        preg_match_all(
            '/AW-\d{9}/m',
            $this->contents,
            $matches
        );

        return $matches[0];
    }

    /**
     * Crawl front office
     *
     * @param int $shopId
     *
     * @return void
     */
    private function crawlFront(int $shopId): void
    {
        $shop = \Shop::getShop($shopId);
        $url = \Tools::getShopProtocol() . $shop[$this->getDomainType()] . $shop['uri'];

        $contents = \Tools::file_get_contents($url);

        $this->contents = $contents;
    }

    /**
     * Retrieve the domain type to use depending on ssl
     *
     * @return string domain type can be domain_ssl || domain
     */
    private function getDomainType(): string
    {
        return \Tools::usingSecureMode() ? 'domain_ssl' : 'domain';
    }
}
