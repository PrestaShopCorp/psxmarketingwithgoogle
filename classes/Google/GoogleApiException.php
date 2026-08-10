<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Google;

use RuntimeException;

final class GoogleApiException extends RuntimeException
{
    /** @var bool */
    private $retryable;

    public function __construct(string $message, bool $retryable = false)
    {
        parent::__construct($message);
        $this->retryable = $retryable;
    }

    public function isRetryable(): bool
    {
        return $this->retryable;
    }
}
