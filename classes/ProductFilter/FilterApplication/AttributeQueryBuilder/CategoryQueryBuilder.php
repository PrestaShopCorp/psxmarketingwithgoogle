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

use Context;
use DbQuery;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Condition;

class CategoryQueryBuilder implements QueryBuilderInterface
{
    /**
     * @var Context
     */
    protected $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    public function addWhereFromFilter(DbQuery $query, $filter, int $index): DbQuery
    {
        // At the time of implementation, CloudSync gets only the default category of the product.
        // We add the condition based on the default category here as well.
        switch ($filter['condition']) {
            case Condition::DOES_CONTAIN:
                $queryConditions = [];
                foreach ($filter['value'] as $value) {
                    $queryConditions[] = 'cl' . $index . '.name LIKE "%' . pSQL($value) . '%"';
                }

                return $query->where('(' . implode(' OR ', $queryConditions) . ')');

            case Condition::DOES_NOT_CONTAIN:
                $queryConditions = [];
                foreach ($filter['value'] as $value) {
                    $queryConditions[] = 'cl' . $index . '.name NOT LIKE "%' . pSQL($value) . '%"';
                }

                return $query->where('(' . implode(' OR ', $queryConditions) . ')');

            case Condition::IS:
                $filteredValues = array_map(function ($item) {
                    return $item['id'];
                }, $filter['value']);

                return $query->where('c' . $index . '.id_category IN (' . implode(', ', array_map('intval', $filteredValues)) . ')');

            case Condition::IS_NOT:
                $filteredValues = array_map(function ($item) {
                    return $item['id'];
                }, $filter['value']);

                return $query->where('c' . $index . '.id_category NOT IN (' . implode(', ', array_map('intval', $filteredValues)) . ')');
        }

        return $query;
    }

    public function addRelations(DbQuery $query, int $index): DbQuery
    {
        return $query->innerJoin('category_product', 'cp' . $index, 'cp' . $index . '.id_product = p.id_product')
            ->innerJoin('category', 'c' . $index, 'c' . $index . '.id_category = cp' . $index . '.id_category')
            ->innerJoin('category_lang', 'cl' . $index, 'c' . $index . '.id_category = cl' . $index . '.id_category')
            ->where('cl' . $index . '.id_lang = ' . (int) $this->context->language->id)
            ->where('c' . $index . '.active = 1');
    }
}
