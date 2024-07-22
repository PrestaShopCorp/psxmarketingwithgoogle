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
use Db;
use DbQuery;

class CategoryRepository
{
    /**
     * @var Context
     */
    private $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    public function getCategoriesList(): array
    {
        $query = new DbQuery();
        $query->select('DISTINCT c.id_category AS id, cl.name AS name')
            ->from('category', 'c')
            ->innerJoin('category_shop', 'cs', 'cs.id_category = c.id_category')
            ->innerJoin('category_lang', 'cl', 'cl.id_category = c.id_category')
            ->where('cs.id_shop = ' . (int) $this->context->shop->id)
            ->where('cl.id_lang = ' . (int) $this->context->language->id)
            // allows you to remove the root category and the categories cannot be administered or assigned to a product.
            ->where('c.id_parent <> 0')
            ->where('c.active = 1');

        return Db::getInstance()->executeS($query);
    }
}
