<?php

use PrestaShop\PrestaShop\Adapter\Module\Configuration\ModuleComplexConfigurationInterface;

class configure_ps_banner implements ModuleComplexConfigurationInterface
{
    public function run()
    {
        $languages = Language::getLanguages(false);

        foreach ($languages as $lang) {
            $values['BANNER_LINK'][(int) $lang['id_lang']] = Context::getContext()->link->getCategoryLink(
                new Category(3),
                null,
                $lang['id_lang']
            );
        }
        Configuration::updateValue('BANNER_LINK', $values['BANNER_LINK']);
    }
}
