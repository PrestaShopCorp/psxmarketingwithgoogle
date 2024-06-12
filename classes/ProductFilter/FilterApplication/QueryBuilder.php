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

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication;

use DbQuery;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\AttributeType;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\BrandQueryBuilder;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\CategoryQueryBuilder;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\FeatureQueryBuilder;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\OutOfStockQueryBuilder;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\PriceQueryBuilder;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\ProductIdQueryBuilder;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\QueryBuilderInterface;

class QueryBuilder
{
    /**
     * @var int
     */
    private $shopId;

    /**
     * @var QueryBuilderInterface[]
     */
    private $builders;

    public function __construct(
        int $shopId,
        BrandQueryBuilder $brandQueryBuilder,
        CategoryQueryBuilder $categoryQueryBuilder,
        FeatureQueryBuilder $featureQueryBuilder,
        OutOfStockQueryBuilder $outOfStockQueryBuilder,
        PriceQueryBuilder $priceQueryBuilder,
        ProductIdQueryBuilder $productIdQueryBuilder
    ) {
        $this->shopId = $shopId;
        $this->builders = [
            AttributeType::BRAND => $brandQueryBuilder,
            AttributeType::CATEGORY => $categoryQueryBuilder,
            AttributeType::FEATURE => $featureQueryBuilder,
            AttributeType::OUT_OF_STOCK => $outOfStockQueryBuilder,
            AttributeType::PRICE => $priceQueryBuilder,
            AttributeType::PRODUCT_ID => $productIdQueryBuilder,
        ];
    }

    public function buildQueryToCount(array $filters): DbQuery
    {
        $query = $this->buildCommonQuery($filters);
        $query->select('COUNT(DISTINCT p.id_product) as total');

        return $query;
    }

    public function buildQueryToList(array $filters): DbQuery
    {
        $query = $this->buildCommonQuery($filters);

        // TODO: Selection of columns seems to depend on filters.
        $query->select('DISTINCT p.id_product, p.*');

        return $query;
    }

    protected function buildCommonQuery(array $filters): DbQuery
    {
        $initiatedRelations = $this->initRelations();
        $query = new DbQuery();

        $query->from('product', 'p');

        $query->innerJoin('product_shop', 'ps', 'ps.id_product = p.id_product');

        $query->where('ps.id_shop = ' . (int) $this->shopId);
        $query->where('ps.active = 1');

        foreach ($filters as $index => $filter) {
            $query = $this->builders[$filter['attribute']]->addRelations($query, $index);
            $query = $this->builders[$filter['attribute']]->addWhereFromFilter($query, $filter, $index);
        }

        return $query;
    }

    private function initRelations(): array
    {
        $initiatedRelations = [];
        foreach (AttributeType::all() as $attribute) {
            $initiatedRelations[$attribute] = false;
        }

        return $initiatedRelations;
    }
}
