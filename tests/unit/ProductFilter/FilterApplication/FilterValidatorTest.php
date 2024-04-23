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

namespace ProductFilter\FilterApplication;

use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\AttributeType;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Condition;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\FilterValidator;

class FilterValidatorTest extends TestCase
{
    public function testCheckEmptyList(): void
    {
        // Most basic check
        $filterValidator = new FilterValidator();

        $this->assertNull($filterValidator->validate([]));
    }

    public function testListIsValid(): void
    {
        $filterValidator = new FilterValidator();

        $this->assertNull(
            $filterValidator->validate([
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                    'values' => ['Brand 1', 'Brand 2'],
                ],
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::LOWER,
                    'value' => 400,
                ],
                [
                    'attribute' => AttributeType::CUSTOM_ATTRIBUTE,
                    'condition' => Condition::IS,
                    'values' => [
                        ['key' => 'Color', 'value' => 'Bleu', 'language' => 'fr'],
                        ['key' => 'Color', 'value' => 'Blue', 'language' => 'en_gb'],
                    ],
                ],
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::GREATER,
                    'value' => 1000,
                ],
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::GREATER,
                    'value' => 100,
                ],
                [
                    'attribute' => AttributeType::OUT_OF_STOCK,
                    'condition' => Condition::IS,
                    'value' => false,
                ],
            ])
        );
    }

    /**
     * BRAND
     *
     * No particular check for Brands. We check single and multi values match the selected condition instead.
     */
    public function testOneValueIsSentWithContains(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 is malformed, a field "value" is excepted instead of "values".');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::BRAND,
                'condition' => Condition::CONTAINS,
                'values' => ['🐶', '🥸'],
            ],
        ]);
    }

    public function testOneValueIsSentWithGeater(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 is malformed, a field "value" is excepted instead of "values".');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::BRAND,
                'condition' => Condition::GREATER,
                'values' => ['🐶', '🥸'],
            ],
        ]);
    }

    public function testOneValueIsSentWithLower(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 is malformed, a field "value" is excepted instead of "values".');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::BRAND,
                'condition' => Condition::LOWER,
                'values' => ['🐶', '🥸'],
            ],
        ]);
    }

    public function testSeveralValuesAreSentWithIsNot(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 is malformed, a field "values" is excepted instead of "value".');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::BRAND,
                'condition' => Condition::IS_NOT,
                'value' => '🐶',
            ],
        ]);
    }

    public function testBothTypesOfValuesCanBeSentWithIs(): void
    {
        $filterValidator = new FilterValidator();

        $this->assertNull(
            $filterValidator->validate([
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                    'value' => '🐶',
                ],
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                    'values' => ['🩹'],
                ],
            ])
        );
    }

    /**
     * CATEGORY
     */
    public function testCategoryWithonNumericValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Value A of filter #0 must be a number.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::CATEGORY,
                'condition' => Condition::IS,
                'values' => [3, 50003, 'A'],
            ],
        ]);
    }

    public function testCategoryWithNegativeValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Value 0 of filter #1 is not a positive number.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::CATEGORY,
                'condition' => Condition::IS,
                'values' => [3, 50003, 1],
            ],
            [
                'attribute' => AttributeType::CATEGORY,
                'condition' => Condition::LOWER,
                'value' => 0,
            ],
        ]);
    }

    /**
     * CUSTOM ATTRIBUTE
     */
    public function testCustomAttributeWithSingleValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 is malformed, a field "values" is excepted instead of "value".');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::CUSTOM_ATTRIBUTE,
                'condition' => Condition::IS,
                'value' => ['key' => 'Color', 'value' => 'Bleu', 'language' => 'fr'],
            ],
        ]);
    }

    public function testCustomAttributeWithMissingLocalizedValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Missing field "value" in filter #0, key #0.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::CUSTOM_ATTRIBUTE,
                'condition' => Condition::IS,
                'values' => [3, 50003, 1],
            ],
        ]);
    }

    public function testCustomAttributeWithMissingLocalizedLanguage(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Missing field "language" in filter #0, key #1.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::CUSTOM_ATTRIBUTE,
                'condition' => Condition::IS,
                'values' => [
                    ['key' => 'Color', 'value' => 'Blue', 'language' => 'fr'],
                    ['key' => 'Color', 'value' => 'Blue'],
                ],
            ],
        ]);
    }

    public function testCustomAttributeWithMissingLocalizedKey(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Missing field "key" in filter #0, key #2.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::CUSTOM_ATTRIBUTE,
                'condition' => Condition::IS,
                'values' => [
                    ['key' => 'Color', 'value' => 'Bleu', 'language' => 'fr'],
                    ['key' => 'Color', 'value' => 'Blue', 'language' => 'en_gb'],
                    ['value' => 'Women', 'language' => 'en_gb'],
                ],
            ],
        ]);
    }

    /**
     * PRICE
     */
    public function testPriceWithNonNumericValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Value 🐶 of filter #0 must be a number.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::PRICE,
                'condition' => Condition::GREATER,
                'value' => '🐶',
            ],
        ]);
    }

    /**
     * (PRODUCT) ID
     */
    public function testProductIdsWithNonNumericValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Value oh no of filter #0 must be a number.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::PRODUCT_ID,
                'condition' => Condition::GREATER,
                'value' => 'oh no',
            ],
            [
                'attribute' => AttributeType::PRODUCT_ID,
                'condition' => Condition::IS_NOT,
                'values' => [102, 50002, 220],
            ],
        ]);
    }

    public function testProductIdsWithNegativeValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Value -220 of filter #1 is not a positive number.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::PRODUCT_ID,
                'condition' => Condition::GREATER,
                'value' => 100,
            ],
            [
                'attribute' => AttributeType::PRODUCT_ID,
                'condition' => Condition::IS_NOT,
                'values' => [102, 50002, -220],
            ],
        ]);
    }

    /**
     * OUT OF STOCK
     */
    public function testOutOfStockWithNonBooleanValue(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Value of filter #0 must be a boolean, string provided');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::OUT_OF_STOCK,
                'condition' => Condition::IS,
                'value' => '🥸',
            ],
        ]);
    }

    public function testOutOfStockWithMultipleValues(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 is malformed, a field "value" is excepted instead of "values".');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::OUT_OF_STOCK,
                'condition' => Condition::IS,
                'values' => [
                    '🥸',
                    'wololo',
                ],
            ],
        ]);
    }
}
