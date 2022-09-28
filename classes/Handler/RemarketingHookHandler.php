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

use Context;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Buffer\TemplateBuffer;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Provider\CartEventDataProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Provider\PageViewEventDataProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Provider\PurchaseEventDataProvider;
use PsxMarketingWithGoogle;

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
     * @var Context
     */
    protected $context;

    /**
     * @var PsxMarketingWithGoogle
     */
    protected $module;

    /**
     * @var bool
     */
    protected $active;

    /**
     * @var array
     */
    protected $conversionLabels;

    public function __construct(ConfigurationAdapter $configurationAdapter, TemplateBuffer $templateBuffer, Context $context, $module)
    {
        $this->configurationAdapter = $configurationAdapter;
        $this->templateBuffer = $templateBuffer;
        $this->context = $context;
        $this->module = $module;

        $this->active = (bool) $this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS)
            && (bool) $this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG)
            && in_array($this->context->controller->controller_type, ['front', 'modulefront']);

        $this->conversionLabels = json_decode($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS), true)
            ?: [];

        if ($this->active) {
            $this->templateBuffer->init($this->findIdentifierFromContext($context));
        }
    }

    public function handleHook(string $hookName, array $data = []): string
    {
        if (!$this->active) {
            return '';
        }

        switch ($hookName) {
            case 'hookDisplayTop':
                if (($sendTo = $this->getSendTo(Config::REMARKETING_CONVERSION_LABEL_PAGE_VIEW)) === null) {
                    break;
                }

                $eventData = $this->module->getService(PageViewEventDataProvider::class)->getEventData($sendTo);

                if ($eventData === null) {
                    break;
                }

                $this->context->smarty->assign([
                    'eventData' => $eventData,
                ]);

                $this->templateBuffer->add(
                    $this->module->display($this->module->getfilePath(), '/views/templates/hook/gtagEvent.tpl')
                );
                break;
            case 'hookDisplayOrderConfirmation':
                if (($sendTo = $this->getSendTo(Config::REMARKETING_CONVERSION_LABEL_PURCHASE)) === null) {
                    break;
                }

                $this->context->smarty->assign([
                    'eventData' => $this->module->getService(PurchaseEventDataProvider::class)->getEventData($sendTo, $data['order']),
                ]);
                $this->templateBuffer->add(
                    $this->module->display($this->module->getfilePath(), '/views/templates/hook/gtagEvent.tpl')
                );
                break;

            case 'hookActionCartUpdateQuantityBefore':
                if ($data['operator'] !== 'up') {
                    break;
                }
                if (($sendTo = $this->getSendTo(Config::REMARKETING_CONVERSION_LABEL_ADD_TO_CART)) === null) {
                    break;
                }

                $this->context->smarty->assign([
                    'eventData' => $this->module->getService(CartEventDataProvider::class)->getEventData($sendTo, $data),
                ]);
                $this->templateBuffer->add(
                    $this->module->display($this->module->getfilePath(), '/views/templates/hook/gtagEvent.tpl')
                );
                break;
        }

        if ($hookName === 'hookDisplayHeader') {
            return base64_decode($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG));
        }

        // Return the existing content in case we have a display hook
        if (strpos($hookName, 'Display') === 4 && !$this->isCurrentRequestAnAjax()) {
            return $this->templateBuffer->flush();
        }

        return '';
    }

    private function getSendTo($eventName)
    {
        if (!empty($this->conversionLabels[$eventName])) {
            return $this->conversionLabels[$eventName];
        }

        return null;
    }

    /**
     * @return bool
     */
    private function isCurrentRequestAnAjax()
    {
        /*
         * An ajax property is available in controllers
         * when the whole page template should not be generated.
         */
        if ($this->context->controller->ajax) {
            return true;
        }

        /*
         * In case the ajax property is not properly set, there is
         * another check available.
         */
        if ($this->context->controller->isXmlHttpRequest()) {
            return true;
        }

        return false;
    }

    /**
     * @return string
     */
    private function findIdentifierFromContext(Context $context)
    {
        if (!empty($context->customer->id_guest)) {
            return 'guest_' . $context->customer->id_guest;
        }
        if (!empty($context->cart->id)) {
            return 'cart_' . $context->cart->id;
        }

        return '';
    }
}
