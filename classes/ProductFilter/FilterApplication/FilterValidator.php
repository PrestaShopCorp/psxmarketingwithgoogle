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
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\AttributeMapConditionOutput;

class FilterValidator
{
    /**
     * @throws InvalidArgumentException
     *
     * See https://phpstan.org/writing-php-code/phpdoc-types#general-arrays
     */
    public function validate(array $filters): void
    {
        foreach ($filters as $index => $filter) {
            if (!isset(AttributeMapConditionOutput::MAP[$filter['attribute']])) {
                throw new InvalidArgumentException('Filter #' . $index . ' has no valid "attribute" field.');
            }

            $attributeConditions = AttributeMapConditionOutput::MAP[$filter['attribute']];

            if (!isset($attributeConditions[$filter['condition']])) {
                throw new InvalidArgumentException('Filter #' . $index . ' has no valid "condition" field.');
            }

            $conditionRequirements = $attributeConditions[$filter['condition']];

            $this->hasValueCompliantWithCondition($filter, $index, $conditionRequirements);
        }
    }

    /**
     * @throws InvalidArgumentException
     *
     * @param $filter
     * @param int $index
     * @param $conditionRequirements
     *
     * @return void
     */
    protected function hasValueCompliantWithCondition($filter, int $index, $conditionRequirements): void
    {
        // number of values check
        if ($conditionRequirements['multiple']) {
            $this->mustHaveSeveralValues($filter, $index);
        } else {
            $this->mustHaveOneValue($filter, $index);
        }

        // type check
        switch ($conditionRequirements['type']) {
            case AttributeMapConditionOutput::STRING:
                $this->mustBeString($filter, $index);
                break;
            case AttributeMapConditionOutput::INT:
                $this->mustBeNumber($filter, $index);
                if ($conditionRequirements['positive']) {
                    $this->mustBePositiveNumber($filter, $index);
                }
                break;
            case AttributeMapConditionOutput::BOOLEAN:
                $this->mustBeBoolean($filter, $index);
                break;
            case AttributeMapConditionOutput::OBJECT:
                $this->mustBeValidObject($filter, $index, $conditionRequirements['keys']);
                break;
        }
    }

    /**
     * @throws InvalidArgumentException
     *
     * @param $filter
     * @param int $index
     *
     * @return void
     */
    protected function mustHaveOneValue($filter, int $index): void
    {
        if (isset($filter['values'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' is malformed, a field "value" is excepted instead of "values".');
        }
        if (!isset($filter['value'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' requires a "value" field.');
        }
    }

    /**
     * @throws InvalidArgumentException
     *
     * @param $filter
     * @param int $index
     *
     * @return void
     */
    protected function mustHaveSeveralValues($filter, int $index): void
    {
        if (isset($filter['value'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' is malformed, a field "values" is excepted instead of "value".');
        }
        if (!isset($filter['values'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' requires a "values" field.');
        }
        if (!is_array($filter['values']) || $this->isAssociativeArray($filter['values'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' is malformed, "values" field need to be an array of value.');
        }
    }

    /**
     * @throws InvalidArgumentException
     *
     * @param $filter
     * @param int $index
     *
     * @return void
     */
    protected function mustBeBoolean($filter, int $index): void
    {
        if (gettype($filter['value']) !== 'boolean') {
            throw new InvalidArgumentException("Value of filter #$index must be a boolean, " . gettype($filter['value']) . ' provided');
        }
    }

    /**
     * @throws InvalidArgumentException
     *
     * @param $filter
     * @param int $index
     *
     * @return void
     */
    protected function mustBeString($filter, int $index): void
    {
        $checkValueIsString = function ($value) use ($index): void {
            if (!is_string($value)) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index must be a string.");
            }
        };

        // Single Value
        if (isset($filter['value'])) {
            $checkValueIsString($filter['value']);
        }

        // Multiple values
        if (isset($filter['values'])) {
            foreach ($filter['values'] as $value) {
                $checkValueIsString($value);
            }
        }
    }

    /**
     * @throws InvalidArgumentException
     *
     * @param $filter
     * @param int $index
     *
     * @return void
     */
    protected function mustBeNumber($filter, int $index): void
    {
        $checkValueIsNumber = function ($value) use ($index): void {
            if (!is_numeric($value)) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index must be a number.");
            }
        };

        // Single Value
        if (isset($filter['value'])) {
            $checkValueIsNumber($filter['value']);
        }

        // Multiple values
        if (isset($filter['values'])) {
            foreach ($filter['values'] as $value) {
                $checkValueIsNumber($value);
            }
        }
    }

    /**
     * @throws InvalidArgumentException
     *
     * @param $filter
     * @param int $index
     *
     * @return void
     */
    protected function mustBePositiveNumber($filter, int $index): void
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

    protected function mustBeValidObject($filter, int $index, array $keys): void
    {
        $checkValueIsValidObject = function ($value) use ($index, $keys): void {
            if (!$this->isAssociativeArray($value)) {
                throw new InvalidArgumentException('Value ' . json_encode($value) . " of filter #$index is not an object.");
            }

            foreach ($keys as $key) {
                if (!array_key_exists($key, $value)) {
                    throw new InvalidArgumentException('Value ' . json_encode($value) . " of filter #$index does not have the required '" . $key . '\' key.');
                }
            }
        };

        // Single Value
        if (isset($filter['value'])) {
            $checkValueIsValidObject($filter['value']);
        }

        // Multiple values
        if (isset($filter['values'])) {
            foreach ($filter['values'] as $value) {
                $checkValueIsValidObject($value);
            }
        }
    }

    protected function isAssociativeArray($array) {
        if (!is_array($array)) {
            return false;
        }

        foreach (array_keys($array) as $key) {
            if (!is_string($key)) {
                return false;
            }
        }
        return true;
    }
}
