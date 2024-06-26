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

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder;

use DbQuery;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Condition;

class OutOfStockQueryBuilder implements QueryBuilderInterface
{
    public function addWhereFromFilter(DbQuery $query, $filter, int $index): DbQuery
    {
        if ($filter['condition'] === Condition::IS) {
            return $filter['value'] ? $query->where('sa' . $index . '.quantity <= 0') : $query->where('sa' . $index . '.quantity > 0');
        }

        return $query;
    }

    public function addRelations(DbQuery $query, int $index): DbQuery
    {
        return $query->innerJoin('stock_available', 'sa' . $index, 'sa' . $index . '.id_product = p.id_product');
    }
}
