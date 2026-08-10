<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;

final class ProductValidationException extends InvalidArgumentException
{
    /** @var array<int, array{field: string, code: string}> */
    private $validationErrors;

    /**
     * @param array<int, array<string, mixed>> $errors
     */
    public function __construct(array $errors)
    {
        $this->validationErrors = [];
        foreach ($errors as $error) {
            $field = $error['field'] ?? '';
            $code = $error['code'] ?? '';
            if (!is_string($field)
                || 1 !== preg_match('/^[A-Za-z][A-Za-z0-9]{0,63}$/D', $field)
                || !is_string($code)
                || 1 !== preg_match('/^[a-z][a-z0-9_]{0,63}$/D', $code)
            ) {
                $field = 'product';
                $code = 'invalid';
            }
            $sanitized = ['field' => $field, 'code' => $code];
            if (!in_array($sanitized, $this->validationErrors, true)) {
                $this->validationErrors[] = $sanitized;
            }
        }
        if ([] === $this->validationErrors) {
            $this->validationErrors[] = ['field' => 'product', 'code' => 'invalid'];
        }

        parent::__construct('Merchant product validation failed.');
    }

    /** @return array<int, array{field: string, code: string}> */
    public function errors(): array
    {
        return $this->validationErrors;
    }
}
