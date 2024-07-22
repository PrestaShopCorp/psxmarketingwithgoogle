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
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\LanguageRepository;

class FeatureQueryBuilder implements QueryBuilderInterface
{
    /**
     * @var Context
     */
    protected $context;

    /**
     * @var LanguageRepository
     */
    protected $languageRepository;

    /**
     * @var string
     */
    protected $currentLanguageIsoCode;

    public function __construct(
        Context $context,
        LanguageRepository $languageRepository
    ) {
        $this->context = $context;
        $this->languageRepository = $languageRepository;
        $this->currentLanguageIsoCode = $this->languageRepository->getIsoById(
            (int) $this->context->language->id
        );
    }

    public function addWhereFromFilter(DbQuery $query, $filter, int $index): DbQuery
    {
        $uniqueFeature = [];

        foreach ($filter['value'] as $value) {
            $uniqueFeature[$value['id']] = $value;
        }

        $uniqueFeature = array_values($uniqueFeature);

        switch ($filter['condition']) {
            case Condition::IS:
                $queryConditions = [];
                foreach ($uniqueFeature as $value) {
                    $queryConditions[] = 'fvl' . $index . '.value = "' . pSQL($value['value']) . '"';
                }

                return $query->where('fl' . $index . '.name = "' . pSQL($uniqueFeature[0]['key']) . '" AND (' . implode(' OR ', $queryConditions) . ')');
            case Condition::IS_NOT:
                $queryConditions = [];
                foreach ($uniqueFeature as $value) {
                    $queryConditions[] = 'fvl' . $index . '.value <> "' . pSQL($value['value']) . '"';
                }

                return $query->where('fl' . $index . '.name = "' . pSQL($uniqueFeature[0]['key']) . '" AND (' . implode(' AND ', $queryConditions) . ')');
        }

        return $query;
    }

    public function addRelations(DbQuery $query, int $index): DbQuery
    {
        return $query
            ->leftJoin('feature_product', 'fp' . $index, 'fp' . $index . '.id_product = p.id_product')
            ->innerJoin('feature_shop', 'fs' . $index, 'fs' . $index . '.id_feature = fp' . $index . '.id_feature')
            ->innerJoin('feature_lang', 'fl' . $index, 'fl' . $index . '.id_feature = fp' . $index . '.id_feature')
            ->innerJoin('feature_value', 'fv' . $index, 'fv' . $index . '.id_feature = fp' . $index . '.id_feature')
            ->innerJoin('feature_value_lang', 'fvl' . $index, '(fvl' . $index . '.id_feature_value = fv' . $index . '.id_feature_value AND fp' . $index . '.id_feature_value = fvl' . $index . '.id_feature_value AND fl' . $index . '.id_lang = fvl' . $index . '.id_lang)')
            ->where('fs' . $index . '.id_shop = ' . (int) $this->context->shop->id);
    }
}
