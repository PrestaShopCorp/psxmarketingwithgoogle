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

class ProductIdQueryBuilder implements QueryBuilderInterface
{
    public function addWhereFromFilter(DbQuery $query, $filter): DbQuery
    {
        switch ($filter['condition']) {
            case Condition::CONTAINS:
                return $query->where('p.id_product LIKE "%' . (int) $filter['value'] . '%"');
            case Condition::GREATER:
                return $query->where('p.id_product > ' . (int) $filter['value']);
            case Condition::LOWER:
                return $query->where('p.id_product < ' . (int) $filter['value']);
            case Condition::IS:
                if ($filter['value']) {
                    return $query->where('p.id_product = ' . (int) $filter['value']);
                }

                return $query->where('p.id_product IN [' . implode(', ', array_map('intval', $filter['values'])) . ']');
            case Condition::IS_NOT:
                return $query->where('p.id_product NOT IN [' . implode(', ', array_map('intval', $filter['values'])) . ']');
        }

        return $query;
    }

    public function addRelations(DbQuery $query): DbQuery
    {
        // Do nothing, product data is already loaded
        return $query;
    }
}
