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

use InvalidArgumentException;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\AttributeType;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Condition;

class FilterValidator
{
    /**
     * @throws InvalidArgumentException
     *
     * TODO: Input input checking with types if possible.
     * See https://phpstan.org/writing-php-code/phpdoc-types#general-arrays
     */
    public function validate(array $filters): void
    {
        foreach ($filters as $index => $filter) {
            $this->hasValueCompliantWithCondition($filter, $index);

            switch ($filter['attribute']) {
                case AttributeType::BRAND:
                    break;
                case AttributeType::CATEGORY:
                    $this->mustContainNumbers($filter, $index);
                    $this->mustContainPositiveNumbers($filter, $index);
                    break;
                case AttributeType::CUSTOM_ATTRIBUTE:
                    $this->mustHaveSeveralValues($filter, $index);
                    $this->mustContainLocalizedValues($filter, $index);
                    break;
                case AttributeType::PRICE:
                    $this->mustContainNumbers($filter, $index);
                    break;
                case AttributeType::PRODUCT_ID:
                    $this->mustContainNumbers($filter, $index);
                    $this->mustContainPositiveNumbers($filter, $index);
                    break;
                case AttributeType::OUT_OF_STOCK:
                    $this->mustHaveOneValue($filter, $index);
                    $this->mustBeBoolean($filter, $index);
                    break;
            }
        }
    }

    protected function hasValueCompliantWithCondition($filter, int $index): void
    {
        switch ($filter['condition']) {
            case Condition::CONTAINS:
                $this->mustHaveOneValue($filter, $index);
                break;
            case Condition::GREATER:
                $this->mustHaveOneValue($filter, $index);
                break;
            case Condition::LOWER:
                $this->mustHaveOneValue($filter, $index);
                break;
            case Condition::IS:
                // Either single or multiple values
                break;
            case Condition::IS_NOT:
                $this->mustHaveSeveralValues($filter, $index);
                break;
        }
    }

    protected function mustHaveOneValue($filter, int $index): void
    {
        if (isset($filter['values'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' is malformed, a field "value" is excepted instead of "values".');
        }
    }

    protected function mustHaveSeveralValues($filter, int $index): void
    {
        if (isset($filter['value'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' is malformed, a field "values" is excepted instead of "value".');
        }
    }

    protected function mustBeBoolean($filter, int $index): void
    {
        if (gettype($filter['value']) !== 'boolean') {
            throw new InvalidArgumentException("Value of filter #$index must be a boolean, " . gettype($filter['value']) . ' provided');
        }
    }

    protected function mustContainNumbers($filter, int $index): void
    {
        $checkValueIsNumeric = function ($value) use ($index): void {
            if (!is_numeric($value)) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index must be a number.");
            }
        };

        // Single Value
        if (isset($filter['value'])) {
            $checkValueIsNumeric($filter['value']);
        }

        // Multiple values
        if (isset($filter['values'])) {
            foreach ($filter['values'] as $value) {
                $checkValueIsNumeric($value);
            }
        }
    }

    protected function mustContainPositiveNumbers($filter, int $index): void
    {
        $checkValueIsPositive = function ($value) use ($index): void {
            if ((int) $value <= 0) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index is not a positive number.");
            }
        };

        // Single Value
        if (isset($filter['value'])) {
            $checkValueIsPositive($filter['value']);
        }

        // Multiple values
        if (isset($filter['values'])) {
            foreach ($filter['values'] as $value) {
                $checkValueIsPositive($value);
            }
        }
    }

    protected function mustContainLocalizedValues($filter, int $index): void
    {
        foreach ($filter['values'] as $localizedValueIndex => $localizedValue) {
            if (empty($localizedValue['value'])) {
                throw new InvalidArgumentException('Missing field "value" in filter #' . $index . ', key #' . $localizedValueIndex . '.');
            }

            if (empty($localizedValue['language'])) {
                throw new InvalidArgumentException('Missing field "language" in filter #' . $index . ', key #' . $localizedValueIndex . '.');
            }

            if (empty($localizedValue['key'])) {
                throw new InvalidArgumentException('Missing field "key" in filter #' . $index . ', key #' . $localizedValueIndex . '.');
            }
        }
    }
}
