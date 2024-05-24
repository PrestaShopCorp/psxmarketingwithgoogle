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

    public function addWhereFromFilter(DbQuery $query, $filter): DbQuery
    {
        // At the time of implementation, CloudSync gets only the default category of the product.
        // We add the condition based on the default category here as well.
        switch ($filter['condition']) {
            case Condition::DOES_CONTAIN:
                $queryConditions = [];
                foreach ($filter['value'] as $value) {
                    $queryConditions[] = 'cl.name LIKE "%' . pSQL($value) . '%"';
                }

                return $query->where('(' . implode(' OR ', $queryConditions) . ')');

            case Condition::DOES_NOT_CONTAIN:
                $queryConditions = [];
                foreach ($filter['value'] as $value) {
                    $queryConditions[] = 'cl.name NOT LIKE "%' . pSQL($value) . '%"';
                }

                return $query->where('(' . implode(' OR ', $queryConditions) . ')');

            case Condition::IS:
                $filteredValues = array_map(function ($item) {
                    return $item['id'];
                }, $filter['value']);

                return $query->where('c.id_category_default IN (' . implode(', ', array_map('intval', $filteredValues)) . ')');

            case Condition::IS_NOT:
                $filteredValues = array_map(function ($item) {
                    return $item['id'];
                }, $filter['value']);

                return $query->where('c.id_category_default NOT IN (' . implode(', ', array_map('intval', $filteredValues)) . ')');
        }

        return $query;
    }

    public function addRelations(DbQuery $query): DbQuery
    {
        return $query->innerJoin('category', 'c', 'c.id_category = p.id_category_default')
            ->innerJoin('category_lang', 'cl', 'c.id_category = cl.id_category')
            ->where('cl.id_lang = ' . (int) $this->context->language->id)
            ->where('c.active = 1');
    }
}
