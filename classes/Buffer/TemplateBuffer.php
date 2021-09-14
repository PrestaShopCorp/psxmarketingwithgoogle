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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Buffer;

class TemplateBuffer
{
    /**
     * @var string
     */
    private $data;

    /**
     * add data to the buffer
     *
     * @param string $data
     *
     * @return void
     */
    public function add($data)
    {
        $this->data .= $data;
    }

    /**
     * reset buffer content
     *
     * @return void
     */
    public function clean()
    {
        $this->data = '';
    }

    /**
     * return buffer content and reset it
     *
     * @return string
     */
    public function flush()
    {
        $returnedData = $this->data;
        $this->clean();

        return !empty($returnedData) ? $returnedData : '';
    }
}
