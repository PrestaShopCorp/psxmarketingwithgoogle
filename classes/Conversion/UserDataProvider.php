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

use Address;
use Cart;
use Country;
use Customer;
use State;

class UserDataProvider
{
    /**
     * @var Customer
     */
    private $customer;

    /**
     * @var Cart
     */
    private $cart;

    public function __construct(
        Customer $customer,
        Cart $cart
    ) {
        $this->customer = $customer;
        $this->cart = $cart;
    }

    /**
     * Return the user personal details
     *
     * @see https://support.google.com/google-ads/answer/13258081#zippy=%2Cidentify-and-define-your-enhanced-conversions-fields
     */
    public function getUserData(): UserData
    {
        $userData = new UserData();
        $userDataAddress = new UserAddressData();

        $userData->setEmail(Hasher::hash(Normalizer::normalize($this->customer->email)));
        $userDataAddress->setFirstName(Hasher::hash(Normalizer::normalize($this->customer->firstname)));
        $userDataAddress->setLastName(Hasher::hash(Normalizer::normalize($this->customer->lastname)));

        $address = $this->getAddressFromCart();
        if (!empty($address)) {
            $userData->setPhoneNumber(Hasher::hash(Normalizer::normalizeInE164($address->phone ?: $address->phone_mobile, $this->getCountryIsoCodeFromAddress($address))));
            $userDataAddress->setStreet(Normalizer::normalize(trim($address->address1 . ' ' . $address->address2)));
            $userDataAddress->setCity(Normalizer::normalize($address->city));
            $userDataAddress->setRegion(Normalizer::normalize($address->id_state ? (new State($address->id_state))->name : null));
            $userDataAddress->setPostalCode(Normalizer::normalize($address->postcode));
            $userDataAddress->setCountry(Normalizer::normalize($address->country));
        }
        $userData->setAddress($userDataAddress);

        return $userData;
    }

    /**
     * @return Address|null
     */
    protected function getAddressFromCart()
    {
        if (!empty($this->cart->id_address_invoice)) {
            return new Address($this->cart->id_address_invoice);
        }

        return null;
    }

    /**
     * @return string|null
     */
    protected function getCountryIsoCodeFromAddress(Address $address)
    {
        if (!empty($address->id_country)) {
            return (new Country($address->id_country))->iso_code;
        }

        return null;
    }
}
