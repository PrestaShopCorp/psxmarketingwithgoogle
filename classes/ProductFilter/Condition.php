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

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter;

/**
 * enum only exists from PHP 8 and the module is compliant with PHP 7.2+,
 * thus cannot be used here.
 */
class Condition
{
    const DOES_CONTAIN = 'does_contain';
    const DOES_NOT_CONTAIN = 'does_not_contain';
    const GREATER = 'greater';
    const LOWER = 'lower';
    const IS = 'is';
    const IS_NOT = 'is_not';
}
