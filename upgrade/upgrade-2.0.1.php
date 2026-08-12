<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

function upgrade_module_2_0_1($module)
{
    $installer = new PrestaShop\Module\PsxMarketingWithGoogle\Database\Installer(
        $module,
        $module->getService(PrestaShop\Module\PsxMarketingWithGoogle\Handler\ErrorHandler::class)
    );
    if (!$installer->installTabs()) {
        return false;
    }

    return psxmgUpgrade201RegisterHooks(
        $module,
        PrestaShop\Module\PsxMarketingWithGoogle\Config\Config::HOOK_LIST
    );
}

function psxmgUpgrade201RegisterHooks($module, array $hooks)
{
    foreach ($hooks as $hook) {
        if ($module->isRegisteredInHook($hook)) {
            continue;
        }
        if (!$module->registerHook($hook)) {
            return false;
        }
    }

    return true;
}
