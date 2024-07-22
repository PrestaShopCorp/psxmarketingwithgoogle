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
    /**
     * GLOBAL
     */
    public function testCheckEmptyList(): void
    {
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
                    'condition' => Condition::DOES_CONTAIN,
                    'value' => ['Brand 1', 'Brand 2'],
                ],
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                    'value' => [
                        ['id' => 1, 'value' => 'brand 1'],
                        ['id' => 122, 'value' => 'brand 2'],
                    ],
                ],
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                    'value' => ['Category 1'],
                ],
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS_NOT,
                    'value' => [
                        ['id' => 133, 'value' => 'category 2'],
                    ],
                ],
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::GREATER,
                    'value' => 1780.10,
                ],
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS,
                    'value' => [100],
                ],
                [
                    'attribute' => AttributeType::OUT_OF_STOCK,
                    'condition' => Condition::IS,
                    'value' => false,
                ],
            ])
        );
    }

    public function testWithInvalidAttribute(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 has no valid "attribute" field.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => '🥸',
                'condition' => Condition::DOES_CONTAIN,
                'value' => ['🐶', '🥸'],
            ],
        ]);
    }

    public function testWithInvalidCondition(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Filter #0 has no valid "condition" field.');

        $filterValidator = new FilterValidator();

        $filterValidator->validate([
            [
                'attribute' => AttributeType::BRAND,
                'condition' => '🥸',
                'value' => ['🐶', '🥸'],
            ],
        ]);
    }

    /**
     * BRAND
     */

    /**
     * @dataProvider brandInvalidArgumentProvider
     */
    public function testBrandInvalidArgument(array $filters, string $expectedExceptionMessage): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage($expectedExceptionMessage);

        $filterValidator = new FilterValidator();
        $filterValidator->validate([$filters]);
    }

    public function brandInvalidArgumentProvider(): array
    {
        return [
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::DOES_CONTAIN,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::DOES_CONTAIN,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 must be a string.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 must be a string.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 is not an object.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS,
                    'value' => [
                        ['id' => 1],
                    ],
                ],
                'Value {"id":1} of filter #0 does not have the required \'value\' key.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS_NOT,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS_NOT,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS_NOT,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 is not an object.',
            ],
            [
                [
                    'attribute' => AttributeType::BRAND,
                    'condition' => Condition::IS_NOT,
                    'value' => [
                        ['id' => 1],
                    ],
                ],
                'Value {"id":1} of filter #0 does not have the required \'value\' key.',
            ],
        ];
    }

    /**
     * CATEGORY
     */

    /**
     * @dataProvider categoryInvalidArgumentProvider
     */
    public function testCategoryInvalidArgument(array $filters, string $expectedExceptionMessage): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage($expectedExceptionMessage);

        $filterValidator = new FilterValidator();
        $filterValidator->validate([$filters]);
    }

    public function categoryInvalidArgumentProvider(): array
    {
        return [
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::DOES_CONTAIN,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::DOES_CONTAIN,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::DOES_CONTAIN,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 must be a string.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::DOES_NOT_CONTAIN,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 must be a string.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 is not an object.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS,
                    'value' => [
                        ['id' => 1],
                    ],
                ],
                'Value {"id":1} of filter #0 does not have the required \'value\' key.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS_NOT,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS_NOT,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS_NOT,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 is not an object.',
            ],
            [
                [
                    'attribute' => AttributeType::CATEGORY,
                    'condition' => Condition::IS_NOT,
                    'value' => [
                        ['id' => 1],
                    ],
                ],
                'Value {"id":1} of filter #0 does not have the required \'value\' key.',
            ],
        ];
    }

    /**
     * PRICE
     */

    /**
     * @dataProvider priceInvalidArgumentProvider
     */
    public function testPriceInvalidArgument(array $filters, string $expectedExceptionMessage): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage($expectedExceptionMessage);

        $filterValidator = new FilterValidator();
        $filterValidator->validate([$filters]);
    }

    public function priceInvalidArgumentProvider(): array
    {
        return [
            [
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::IS,
                    'value' => '🐶',
                ],
                'Value 🐶 of filter #0 must be a number.',
            ],
            [
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::IS,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::GREATER,
                    'value' => '🐶',
                ],
                'Value 🐶 of filter #0 must be a number.',
            ],
            [
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::GREATER,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::LOWER,
                    'value' => '🐶',
                ],
                'Value 🐶 of filter #0 must be a number.',
            ],
            [
                [
                    'attribute' => AttributeType::PRICE,
                    'condition' => Condition::LOWER,
                ],
                'Filter #0 requires a "value" field.',
            ],
        ];
    }

    /**
     * PRODUCT_ID
     */

    /**
     * @dataProvider productIdInvalidArgumentProvider
     */
    public function testProductIdInvalidArgument(array $filters, string $expectedExceptionMessage): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage($expectedExceptionMessage);

        $filterValidator = new FilterValidator();
        $filterValidator->validate([$filters]);
    }

    public function productIdInvalidArgumentProvider(): array
    {
        return [
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS,
                    'value' => ['🐶'],
                ],
                'Value 🐶 of filter #0 must be a number.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS,
                    'value' => [-1],
                ],
                'Value -1 of filter #0 is not a positive number.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS,
                    'value' => [1, 1.50],
                ],
                'Value 1.5 of filter #0 is not an integer.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS_NOT,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS_NOT,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS_NOT,
                    'value' => ['🐶'],
                ],
                'Value 🐶 of filter #0 must be a number.',
            ],
            [
                [
                    'attribute' => AttributeType::PRODUCT_ID,
                    'condition' => Condition::IS_NOT,
                    'value' => [-1],
                ],
                'Value -1 of filter #0 is not a positive number.',
            ],
        ];
    }

    /**
     * OUT_OF_STOCK
     */

    /**
     * @dataProvider outOfStockInvalidArgumentProvider
     */
    public function testOutOfStockInvalidArgument(array $filters, string $expectedExceptionMessage): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage($expectedExceptionMessage);

        $filterValidator = new FilterValidator();
        $filterValidator->validate([$filters]);
    }

    public function outOfStockInvalidArgumentProvider(): array
    {
        return [
            [
                [
                    'attribute' => AttributeType::OUT_OF_STOCK,
                    'condition' => Condition::IS,
                    'value' => '🐶',
                ],
                'Value of filter #0 must be a boolean, string provided',
            ],
            [
                [
                    'attribute' => AttributeType::OUT_OF_STOCK,
                    'condition' => Condition::IS,
                ],
                'Filter #0 requires a "value" field.',
            ],
        ];
    }

    /**
     * FEATURE
     */

    /**
     * @dataProvider featureInvalidArgumentProvider
     */
    public function testFeatureInvalidArgument(array $filters, string $expectedExceptionMessage): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage($expectedExceptionMessage);

        $filterValidator = new FilterValidator();
        $filterValidator->validate([$filters]);
    }

    public function featureInvalidArgumentProvider(): array
    {
        return [
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 is not an object.',
            ],
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS,
                    'value' => [
                        ['id' => 1],
                    ],
                ],
                'Value {"id":1} of filter #0 does not have the required \'key\' key.',
            ],
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS_NOT,
                    'value' => '🐶',
                ],
                'Filter #0 is malformed, "value" field need to be an array of value.',
            ],
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS_NOT,
                ],
                'Filter #0 requires a "value" field.',
            ],
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS_NOT,
                    'value' => [1, 2, 3],
                ],
                'Value 1 of filter #0 is not an object.',
            ],
            [
                [
                    'attribute' => AttributeType::FEATURE,
                    'condition' => Condition::IS_NOT,
                    'value' => [
                        ['id' => 1],
                    ],
                ],
                'Value {"id":1} of filter #0 does not have the required \'key\' key.',
            ],
        ];
    }
}
