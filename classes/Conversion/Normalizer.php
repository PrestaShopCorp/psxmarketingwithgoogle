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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Conversion;

use Brick\PhoneNumber\PhoneNumber;
use Brick\PhoneNumber\PhoneNumberFormat;
use Exception;

class Normalizer
{
    /**
     * @param string|null $data
     * @param string|null $additionalNormalization
     *
     * @return string|null
     */
    public static function normalize($data, $additionalNormalization = null)
    {
        if (empty($data)) {
            return null;
        }

        $data = trim(strtolower($data));

        if ($additionalNormalization === 'phone') {
            return self::normalizePhoneNumber($data);
        }

        return $data;
    }

    public static function normalizePhoneNumber(string $data): string
    {
        $dataWithPlusAndNumbers = preg_replace('/([-\s\(\)])/', '', $data);

        return preg_replace('/^(0{2})/', '+', $dataWithPlusAndNumbers);
    }

    /**
     * @param string|null $data
     * @param string $countryCode
     *
     * @return string|null
     */
    public static function normalizeInE164($data, $countryCode)
    {
        if (empty($data)) {
            return null;
        }
        try {
            return PhoneNumber::parse($data, $countryCode)->format(PhoneNumberFormat::E164);
        } catch (Exception $e) {
            return $data;
        }
    }
}
