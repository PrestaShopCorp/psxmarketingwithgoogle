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
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;

class VerificationTagRepository
{
    /**
     * @var Db
     */
    private $db;

    /**
     * @var Context
     */
    private $context;

    public function __construct(Db $db, Context $context)
    {
        $this->db = $db;
        $this->context = $context;
    }

    /**
     * @return array|false
     */
    public function getConfiguration()
    {
        $query = new DbQuery();

        $query->select('c.value, c.date_upd')
            ->from('configuration', 'c')
            ->where('(c.id_shop = ' . (int) $this->context->shop->id . ' or ISNULL(c.id_shop))')
            ->where('c.name = "' . Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META . '"');

        return $this->db->getRow($query);
    }
}
