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

    /** @var int|null */
    private $statusCode;

    /** @var string */
    private $safeCode;

    public function __construct(
        string $message,
        bool $retryable = false,
        ?int $statusCode = null,
        string $safeCode = 'google_request_failed'
    ) {
        parent::__construct($message);
        $this->retryable = $retryable;
        $this->statusCode = $statusCode;
        $this->safeCode = $safeCode;
    }

    public function isRetryable(): bool
    {
        return $this->retryable;
    }

    public function statusCode(): ?int
    {
        return $this->statusCode;
    }

    public function safeCode(): string
    {
        return $this->safeCode;
    }
}
