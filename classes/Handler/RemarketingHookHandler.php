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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Handler;

use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Buffer\TemplateBuffer;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;

class RemarketingHookHandler
{
    /**
     * @var ConfigurationAdapter
     */
    protected $configurationAdapter;

    /**
     * @var TemplateBuffer
     */
    protected $templateBuffer;

    /**
     * @var bool
     */
    protected $active;

    public function __construct(ConfigurationAdapter $configurationAdapter, TemplateBuffer $templateBuffer)
    {
        $this->configurationAdapter = $configurationAdapter;
        $this->templateBuffer = $templateBuffer;

        $this->active = (bool) $this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS)
            && (bool) $this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG);
    }

    public function handleHook(string $hookName, array $data = []): string
    {
        if (!$this->active) {
            return '';
        }

        switch ($hookName) {
            case 'hookDisplayHeader':
                $this->templateBuffer->add(base64_decode($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG)));
                break;

            case 'HookDisplayOrderConfirmation':
                $this->templateBuffer->add('gtag(\'event\', \'purchase\', ' . json_encode([]) . ')');
                break;
        }

        // Return the existing content in case we have a display hook
        if (strpos($hookName, 'Display') === 4) {
            return $this->templateBuffer->flush();
        }

        return '';
    }
}
