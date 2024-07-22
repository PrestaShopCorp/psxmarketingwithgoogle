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

class BrandQueryBuilder implements QueryBuilderInterface
{
    public function addWhereFromFilter(DbQuery $query, $filter, int $index): DbQuery
    {
        switch ($filter['condition']) {
            case Condition::DOES_CONTAIN:
                $queryConditions = [];
                foreach ($filter['value'] as $value) {
                    $queryConditions[] = 'm' . $index . '.name LIKE "%' . pSQL($value) . '%"';
                }

                return $query->where('(' . implode(' OR ', $queryConditions) . ')');

            case Condition::DOES_NOT_CONTAIN:
                $queryConditions = [];
                foreach ($filter['value'] as $value) {
                    $queryConditions[] = 'm' . $index . '.name NOT LIKE "%' . pSQL($value) . '%"';
                }

                return $query->where('(' . implode(' OR ', $queryConditions) . ')');

            case Condition::IS:
                $filteredValues = array_map(function ($item) {
                    return $item['value'];
                }, $filter['value']);

                return $query->where('m' . $index . '.name IN ("' . implode('", "', array_map('pSQL', $filteredValues)) . '")');

            case Condition::IS_NOT:
                $filteredValues = array_map(function ($item) {
                    return $item['value'];
                }, $filter['value']);

                return $query->where('m' . $index . '.name NOT IN ("' . implode('", "', array_map('pSQL', $filteredValues)) . '")');
        }

        return $query;
    }

    public function addRelations(DbQuery $query, int $index): DbQuery
    {
        return $query->innerJoin('manufacturer', 'm' . $index, 'm' . $index . '.id_manufacturer = p.id_manufacturer')
            ->where('m' . $index . '.active = 1');
    }
}
