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

use Module;

class ModuleRepository
{
    const MODULE_NAME = 'ps_eventbus';
    const VERSION = '1.4.0';

    public function eventBusIsUpToDate()
    {
        $module = Module::getInstanceByName(self::MODULE_NAME);

        if ($module instanceof \Ps_EventBus) {
            return version_compare(
                self::VERSION,
                $module->version,
                '>='
            );
        }

        return false;
    }
}


?>
