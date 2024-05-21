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
                $this->mustBeString($filter, $index, $conditionRequirements);
                break;
            case AttributeMapConditionOutput::INT:
                $this->mustBeNumber($filter, $index, $conditionRequirements);
                if ($conditionRequirements['positive']) {
                    $this->mustBePositiveNumber($filter, $index, $conditionRequirements);
                }
                if ($conditionRequirements['integer']) {
                    $this->mustBeInteger($filter, $index, $conditionRequirements);
                }
                break;
            case AttributeMapConditionOutput::BOOLEAN:
                $this->mustBeBoolean($filter, $index);
                break;
            case AttributeMapConditionOutput::OBJECT:
                $this->mustBeValidObject($filter, $index, $conditionRequirements);
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
        if (!isset($filter['value'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' requires a "value" field.');
        }
        if (is_array($filter['value']) && !$this->isAssociativeArray($filter['value'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' is malformed, "value" field need to be one value.');
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
        if (!isset($filter['value'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' requires a "value" field.');
        }
        if (!is_array($filter['value']) || $this->isAssociativeArray($filter['value'])) {
            throw new InvalidArgumentException('Filter #' . $index . ' is malformed, "value" field need to be an array of value.');
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
     * @param $conditionRequirements
     *
     * @return void
     */
    protected function mustBeString($filter, int $index, $conditionRequirements): void
    {
        $checkValueIsString = function ($value) use ($index): void {
            if (!is_string($value)) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index must be a string.");
            }
        };

        // Single Value
        if ($conditionRequirements['multiple']) {
            foreach ($filter['value'] as $value) {
                $checkValueIsString($value);
            }
        } else {
            $checkValueIsString($filter['value']);
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
    protected function mustBeNumber($filter, int $index, $conditionRequirements): void
    {
        $checkValueIsNumber = function ($value) use ($index): void {
            if (!is_numeric($value)) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index must be a number.");
            }
        };

        if ($conditionRequirements['multiple']) {
            foreach ($filter['value'] as $value) {
                $checkValueIsNumber($value);
            }
        } else {
            $checkValueIsNumber($filter['value']);
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
    protected function mustBePositiveNumber($filter, int $index, $conditionRequirements): void
    {
        $checkValueIsPositive = function ($value) use ($index): void {
            if ($value < 0) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index is not a positive number.");
            }
        };

        if ($conditionRequirements['multiple']) {
            foreach ($filter['value'] as $value) {
                $checkValueIsPositive($value);
            }
        } else {
            $checkValueIsPositive($filter['value']);
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
    protected function mustBeInteger($filter, int $index, $conditionRequirements): void
    {
        $checkValueIsInteger = function ($value) use ($index): void {
            if (!is_int($value)) {
                throw new InvalidArgumentException('Value ' . $value . " of filter #$index is not an integer.");
            }
        };

        if ($conditionRequirements['multiple']) {
            foreach ($filter['value'] as $value) {
                $checkValueIsInteger($value);
            }
        } else {
            $checkValueIsInteger($filter['value']);
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
    protected function mustBeValidObject($filter, int $index, $conditionRequirements): void
    {
        $checkValueIsValidObject = function ($value) use ($index, $conditionRequirements): void {
            if (!$this->isAssociativeArray($value)) {
                throw new InvalidArgumentException('Value ' . json_encode($value) . " of filter #$index is not an object.");
            }

            foreach ($conditionRequirements['keys'] as $key) {
                if (!array_key_exists($key, $value)) {
                    throw new InvalidArgumentException('Value ' . json_encode($value) . " of filter #$index does not have the required '" . $key . '\' key.');
                }
            }
        };

        if ($conditionRequirements['multiple']) {
            foreach ($filter['value'] as $value) {
                $checkValueIsValidObject($value);
            }
        } else {
            $checkValueIsValidObject($filter['value']);
        }
    }

    /**
     * @param $array
     *
     * @return bool
     */
    protected function isAssociativeArray($array): bool
    {
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
