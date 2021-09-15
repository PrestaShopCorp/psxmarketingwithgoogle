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

use Db;
use DbQuery;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;

class CategoryRepository
{
    const NO_CHILDREN = 0;
    const HAS_CHILDREN = 1;

    /**
     * @var int
     */
    private $homeCategoryId;

    public function __construct(ConfigurationAdapter $configurationAdapter)
    {
        $this->homeCategoryId = (int) $configurationAdapter->get('PS_HOME_CATEGORY');
    }

    /**
     * @param int $langId
     * @param int $shopId
     *
     * @return array
     *
     * @throws \PrestaShopDatabaseException
     */
    public function getCategoriesWithParentInfo($langId, $shopId)
    {
        $query = new DbQuery();
        $query->select('c.id_category, cl.name, c.id_parent')
            ->from('category', 'c')
            ->leftJoin(
                'category_lang',
                'cl',
                'cl.id_category = c.id_category AND cl.id_shop = ' . (int) $shopId
            )
            ->where('cl.id_lang = ' . (int) $langId)
            ->orderBy('cl.id_category');
        $result = Db::getInstance()->executeS($query);
        if ($result) {
            return $result;
        } else {
            throw new \PrestaShopDatabaseException('No categories found');
        }
    }

    /**
     * @param int $shopId
     *
     * @return int
     */
    public function getNumberOfTotalCategories($shopId)
    {
        $sql = new DbQuery();
        $sql->select('c.id_category');
        $sql->from('category', 'c');
        $sql->innerJoin('category_shop', 'cp', 'cp.id_category = c.id_category');
        $sql->where('cp.id_shop = ' . (int) $shopId . ' AND c.id_parent >=' . (int) $this->homeCategoryId);

        Db::getInstance()->execute($sql);

        return Db::getInstance()->numRows();
    }
}
