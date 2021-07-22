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

class TaxRepository
{
    /**
     * @var Db
     */
    private $db;

    /**
     * @var Context
     */
    private $context;

    private $countryIsoCodeCache = [];

    public function __construct(Db $db, Context $context)
    {
        $this->db = $db;
        $this->context = $context;
    }

    private function getBaseQuery(): DbQuery
    {
        $query = new DbQuery();

        $query->from('tax', 't')
            ->innerJoin('tax_rule', 'tr', 'tr.id_tax = t.id_tax')
            ->innerJoin('tax_rules_group', 'trg', 'trg.id_tax_rules_group = tr.id_tax_rules_group')
            ->innerJoin('tax_rules_group_shop', 'trgs', 'trgs.id_tax_rules_group = tr.id_tax_rules_group')
            ->innerJoin('tax_lang', 'tl', 'tl.id_tax = t.id_tax')
            ->where('trgs.id_shop = ' . (int) $this->context->shop->id)
            ->where('tl.id_lang = ' . (int) $this->context->language->id);

        return $query;
    }

    public function getCarrierTaxesByTaxRulesGroupId(int $taxRulesGroupId, bool $active = true): array
    {
        $cacheKey = (int) $taxRulesGroupId . '-' . (int) $active;

        if (!isset($this->countryIsoCodeCache[$cacheKey])) {
            $query = $this->getBaseQuery();

            $query->select('rate, c.iso_code as country_iso_code, GROUP_CONCAT(s.iso_code SEPARATOR ",") as state_iso_code');
            $query->leftJoin('country', 'c', 'c.id_country = tr.id_country');
            $query->leftJoin('state', 's', 's.id_state = tr.id_state');
            $query->where('tr.id_tax_rules_group = ' . (int) $taxRulesGroupId);
            $query->where('c.active = ' . (bool) $active);
            $query->where('s.active = ' . (bool) $active . ' OR s.active IS NULL');
            $query->where('t.active = ' . (bool) $active);
            $query->where('c.iso_code IS NOT NULL');

            $this->countryIsoCodeCache[$cacheKey] = $this->db->executeS($query);
        }

        return $this->countryIsoCodeCache[$cacheKey];
    }
}
