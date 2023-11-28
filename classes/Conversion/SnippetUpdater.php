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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Conversion;

class SnippetUpdater
{
    /**
     * @var string
     */
    private $snippet;

    public function __construct(
        string $originalSnippet
    ) {
        $this->snippet = $originalSnippet;
    }

    public function addEnhancedConversion(): self
    {
        $this->snippet = preg_replace("/(gtag\('config', 'AW-[0-9]+')()(\);)/im", '${1}, {\'allow_enhanced_conversions\': true}${3}', $this->snippet);

        return $this;
    }

    public function removeEnhancedConversion(): self
    {
        $this->snippet = str_replace(", {'allow_enhanced_conversions': true}", '', $this->snippet);

        return $this;
    }

    public function getSnippet(): string
    {
        return $this->snippet;
    }
}
