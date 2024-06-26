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

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter;

class AttributeMapConditionOutput
{
    const STRING = 'string';
    const INT = 'int';
    const BOOLEAN = 'boolean';
    const OBJECT = 'object';

    const MAP = [
        AttributeType::BRAND => [
            Condition::DOES_CONTAIN => [
                'multiple' => true,
                'type' => self::STRING,
            ],
            Condition::DOES_NOT_CONTAIN => [
                'multiple' => true,
                'type' => self::STRING,
            ],
            Condition::IS => [
                'multiple' => true,
                'type' => self::OBJECT,
                'keys' => ['value', 'id'],
            ],
            Condition::IS_NOT => [
                'multiple' => true,
                'type' => self::OBJECT,
                'keys' => ['value', 'id'],
            ],
        ],
        AttributeType::CATEGORY => [
            Condition::DOES_CONTAIN => [
                'multiple' => true,
                'type' => self::STRING,
            ],
            Condition::DOES_NOT_CONTAIN => [
                'multiple' => true,
                'type' => self::STRING,
            ],
            Condition::IS => [
                'multiple' => true,
                'type' => self::OBJECT,
                'keys' => ['value', 'id'],
            ],
            Condition::IS_NOT => [
                'multiple' => true,
                'type' => self::OBJECT,
                'keys' => ['value', 'id'],
            ],
        ],
        AttributeType::PRICE => [
            Condition::IS => [
                'multiple' => false,
                'type' => self::INT,
                'positive' => true,
                'integer' => false,
            ],
            Condition::GREATER => [
                'multiple' => false,
                'type' => self::INT,
                'positive' => true,
                'integer' => false,
            ],
            Condition::LOWER => [
                'multiple' => false,
                'type' => self::INT,
                'positive' => true,
                'integer' => false,
            ],
        ],
        AttributeType::PRODUCT_ID => [
            Condition::IS => [
                'multiple' => true,
                'type' => self::INT,
                'positive' => true,
                'integer' => true,
            ],
            Condition::IS_NOT => [
                'multiple' => true,
                'type' => self::INT,
                'positive' => true,
                'integer' => true,
            ],
        ],
        AttributeType::OUT_OF_STOCK => [
            Condition::IS => [
                'multiple' => false,
                'type' => self::BOOLEAN,
            ],
        ],
        AttributeType::FEATURE => [
            Condition::IS => [
                'multiple' => true,
                'type' => self::OBJECT,
                'keys' => ['id', 'key', 'value', 'language'],
            ],
            Condition::IS_NOT => [
                'multiple' => true,
                'type' => self::OBJECT,
                'keys' => ['id', 'key', 'value', 'language'],
            ],
        ],
    ];
}
