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

use JsonSerializable;

class UserData implements JsonSerializable
{
    /**
     * @var string|null
     */
    private $email;

    /**
     * @var string|null
     */
    private $phoneNumber;

    /**
     * @var UserAddressData|null
     */
    private $address;

    public function jsonSerialize(): array
    {
        $data = [];

        if (!empty($this->email)) {
            $data['sha256_email_address'] = $this->email;
        }

        if (!empty($this->phoneNumber)) {
            $data['sha256_phone_number'] = $this->phoneNumber;
        }

        if (!empty($this->address) && !$this->address->isEmpty()) {
            $data['address'] = $this->address;
        }

        return $data;
    }

    /**
     * @return bool
     */
    public function isEmpty()
    {
        if (!$this->address->isEmpty()) {
            return false;
        }

        foreach (get_object_vars($this) as $var => $value) {
            if ($var === 'address') {
                continue;
            }
            if (!empty($value)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the value of email
     *
     * @return string|null
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @param string|null $email
     *
     * @return self
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get the value of phoneNumber
     *
     * @return string|null
     */
    public function getPhoneNumber()
    {
        return $this->phoneNumber;
    }

    /**
     * Set the value of phoneNumber
     *
     * @param string|null $phoneNumber
     *
     * @return self
     */
    public function setPhoneNumber($phoneNumber)
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    /**
     * Get the value of address
     *
     * @return UserAddressData|null
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set the value of address
     *
     * @param UserAddressData|null $address
     *
     * @return self
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }
}
