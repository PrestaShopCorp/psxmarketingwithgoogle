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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Repository;

use Context;
use Module;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\PrestaShop\Adapter\SymfonyContainer;

class ModuleRepository
{
    /**
     * @var string
     */
    private $moduleName;

    public function __construct(string $moduleName)
    {
        $this->moduleName = $moduleName;
    }

    /**
     * @return string|null
     */
    public function getModuleVersion()
    {
        /** @var Module $module */
        $module = Module::getInstanceByName($this->moduleName);

        if (!empty($module)) {
            return $module->version;
        }

        return null;
    }

    /**
     * @return string
     */
    public function getUpgradeLink()
    {
        $router = SymfonyContainer::getInstance()->get('router');

        return \Tools::getHttpHost(true) . $router->generate('admin_module_manage_action', [
            'action' => 'upgrade',
            'module_name' => $this->moduleName,
        ]);
    }

    /**
     * @return string
     */
    public function getEnableLink()
    {
        $router = SymfonyContainer::getInstance()->get('router');

        return \Tools::getHttpHost(true) . $router->generate('admin_module_manage_action', [
            'action' => 'enable',
            'module_name' => $this->moduleName,
        ]);
    }

    /**
     * @return array
     */
    public function getInformationsAboutModule(): array
    {
        return [
            'version' => $this->getModuleVersion(),
            'upgradeLink' => $this->getUpgradeLink(),
            'hooks' => $this->getActiveHooks(),
        ];
    }

    /**
     * @return bool
     */
    public function moduleIsEnabled(): bool
    {
        return Module::isEnabled($this->moduleName);
    }

    /**
     * @return array
     */
    public function getActiveHooks(): array
    {
        $context = Context::getContext();
        $hooks = [];
        /** @var Module $moduleInstance */
        $moduleInstance = Module::getInstanceByName($this->moduleName);

        if (empty($moduleInstance)) {
            return $hooks;
        }

        foreach (Config::HOOK_LIST as $hook) {
            $hooks[$hook] = \Hook::isModuleRegisteredOnHook($moduleInstance, $hook, $context->shop->id);
        }

        return $hooks;
    }
}
