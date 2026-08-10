<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\OAuth;

final class TokenSet
{
    /** @var string */
    private $accessToken;

    /** @var int */
    private $expiresIn;

    /** @var string|null */
    private $refreshToken;

    public function __construct(string $accessToken, int $expiresIn, ?string $refreshToken)
    {
        $this->accessToken = $accessToken;
        $this->expiresIn = $expiresIn;
        $this->refreshToken = $refreshToken;
    }

    public function accessToken(): string
    {
        return $this->accessToken;
    }

    public function expiresIn(): int
    {
        return $this->expiresIn;
    }

    public function refreshToken(): ?string
    {
        return $this->refreshToken;
    }
}
