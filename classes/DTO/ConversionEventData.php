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

namespace PrestaShop\Module\PsxMarketingWithGoogle\DTO;

use JsonSerializable;

/**
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#action-data
 */
class ConversionEventData implements JsonSerializable
{
    /**
     * Value (i.e. revenue) associated with the event.
     *
     * @var string
     */
    protected $value;

    /**
     * @var string
     */
    protected $currency;

    /**
     * @var string
     */
    protected $sendTo;

    /**
     * The transaction ID (e.g. T1234).
     *
     * @var string|null
     */
    protected $transactionId;

    public function jsonSerialize(): array
    {
        $eventData = [
            'send_to' => $this->sendTo,
            'value' => $this->value,
            'currency' => $this->currency,
        ];
        if ($this->transactionId) {
            $eventData['transaction_id'] = $this->transactionId;
        }

        return $eventData;
    }

    public function setTransactionId(string $transactionId)
    {
        $this->transactionId = $transactionId;

        return $this;
    }

    /**
     * Set value (i.e. revenue) associated with the event.
     *
     * @param string|null $value Value (i.e. revenue) associated with the event.
     *
     * @return self
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @param string|null $currency
     *
     * @return self
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * @param string|null $sendTo
     *
     * @return self
     */
    public function setSendTo($sendTo)
    {
        $this->sendTo = $sendTo;

        return $this;
    }
}
