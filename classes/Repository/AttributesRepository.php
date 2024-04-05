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
use Shop;

class AttributesRepository
{
    /**
     * @var Context
     */
    private $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    /**
     * Get all custom attributes that are used as product features and combination of attributes.
     * Data used in Product feed configuration > Attribute mapping.
     *
     * @return array
     */
    public function getAllAttributes(): array
    {
        $attributes = [];

        foreach ($this->getCustomAttributes() as $attr) {
            $attributes[] = [
                // Not the best way in terms of permances, but avoid being responsible of a whole SQL query.
                'name' => array_values(array_unique((array) (new \AttributeGroupCore($attr['id_attribute_group']))->name)),
                'type' => 'custom',
            ];
        }

        foreach ($this->getFeatures() as $feature) {
            $attributes[] = [
                // Not the best way in terms of permances, but avoid being responsible of a whole SQL query.
                'name' => array_values(array_unique((array) (new \FeatureCore($feature['id_feature']))->name)),
                'type' => 'feature',
            ];
        }

        return $attributes;
    }

    /**
     * Data used for Product filters
     */
    public function getCustomAttributesWithLocalizedValues(): array
    {
        Shop::setContext(Shop::CONTEXT_SHOP, $this->context->shop->id);

        // SQL request taken and adapted from ProductAttribute::getAttributes as there it is returning values only for a given language.
        return \Db::getInstance()->executeS('
			SELECT DISTINCT ag.id_attribute_group, al.id_attribute, al.id_lang, al.`name`, agl.`name` AS `attribute_group`
			FROM `' . _DB_PREFIX_ . 'attribute_group` ag
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute_group_lang` agl
				ON (ag.`id_attribute_group` = agl.`id_attribute_group`
                AND agl.`id_lang` = ' . (int) $this->context->language->id . ')
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute` a
				ON a.`id_attribute_group` = ag.`id_attribute_group`
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute_lang` al
				ON (a.`id_attribute` = al.`id_attribute`)
			' . Shop::addSqlAssociation('attribute_group', 'ag') . '
			' . Shop::addSqlAssociation('attribute', 'a') .
            'WHERE a.`id_attribute` IS NOT NULL
                AND al.`name` IS NOT NULL
                AND agl.`id_attribute_group` IS NOT NULL
			ORDER BY agl.`name` ASC, a.`position` ASC
		');
    }

    /**
     * Data used for Product filters
     */
    public function getFeaturesWithLocalizedValues(): array
    {
        $query = new DbQuery();
        $query->select('f.id_feature, fvl.id_lang, fl.name AS feature_name, fvl.id_feature_value, fvl.value')
            ->from('feature', 'f')
            ->innerJoin('feature_shop', 'fs', 'fs.id_feature = f.id_feature')
            ->innerJoin('feature_lang', 'fl', 'fl.id_feature = f.id_feature')
            ->innerJoin('feature_value', 'fv', 'fv.id_feature = f.id_feature')
            ->innerJoin('feature_value_lang', 'fvl', 'fvl.id_feature_value = fv.id_feature_value')
            ->where('fs.id_shop = ' . (int) $this->context->shop->id)
            ->where('fl.id_lang = ' . (int) $this->context->language->id);

        return Db::getInstance()->executeS($query);
    }

    protected function getCustomAttributes(): array
    {
        return \AttributeGroupCore::getAttributesGroups($this->context->language->id);
    }

    protected function getFeatures(): array
    {
        return \FeatureCore::getFeatures($this->context->language->id);
    }
}
