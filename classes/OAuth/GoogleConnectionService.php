<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\OAuth;

use DateTimeImmutable;
use InvalidArgumentException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;

final class GoogleConnectionService
{
    private const STATE_TTL = '+10 minutes';
    private const TOKEN_EXPIRY_SAFETY_SECONDS = 60;

    /** @var OAuthStateRepository */
    private $states;

    /** @var GoogleCredentialRepository */
    private $credentials;

    /** @var GoogleOAuthClient */
    private $client;

    /** @var array<int, array{access_token: string, expires_at: int}> */
    private $accessTokens = [];

    public function __construct(
        OAuthStateRepository $states,
        GoogleCredentialRepository $credentials,
        GoogleOAuthClient $client
    ) {
        $this->states = $states;
        $this->credentials = $credentials;
        $this->client = $client;
    }

    public function authorizationUrl(int $shopId, int $employeeId, string $redirectUri): string
    {
        $connection = $this->requireConfiguration($shopId);
        $state = $this->states->issue($shopId, $employeeId, new DateTimeImmutable(self::STATE_TTL));

        return $this->client->authorizationUrl($connection['client_id'], $redirectUri, $state);
    }

    public function complete(int $shopId, string $state, string $code, string $redirectUri): void
    {
        if ('' === $state || '' === $code) {
            throw new InvalidArgumentException('OAuth state and code are required.');
        }

        $this->states->consume($state, $shopId);
        $connection = $this->requireConfiguration($shopId);
        $tokens = $this->client->exchangeCode(
            $connection['client_id'],
            $connection['client_secret'],
            $code,
            $redirectUri
        );
        $refreshToken = $tokens->refreshToken();
        if (null === $refreshToken && empty($connection['refresh_token'])) {
            throw new GoogleApiException('Google did not provide offline access.');
        }

        $profile = $this->client->userInfo($tokens->accessToken());
        $update = ['google_email' => $profile['email']];
        if (null !== $refreshToken) {
            $update['refresh_token'] = $refreshToken;
        }
        $this->credentials->save($shopId, $update);
        $this->cacheAccessToken($shopId, $tokens);
    }

    public function accessToken(int $shopId): string
    {
        if (isset($this->accessTokens[$shopId])
            && $this->accessTokens[$shopId]['expires_at'] > time()
        ) {
            return $this->accessTokens[$shopId]['access_token'];
        }

        $connection = $this->requireConfiguration($shopId);
        $refreshToken = $connection['refresh_token'] ?? null;
        if (!is_string($refreshToken) || '' === $refreshToken) {
            throw new GoogleApiException('Google connection requires authorization.');
        }

        $tokens = $this->client->refresh(
            $connection['client_id'],
            $connection['client_secret'],
            $refreshToken
        );
        if (null !== $tokens->refreshToken()) {
            $this->credentials->save($shopId, ['refresh_token' => $tokens->refreshToken()]);
        }
        $this->cacheAccessToken($shopId, $tokens);

        return $tokens->accessToken();
    }

    /** @return array{connected: bool, googleEmail: string|null, merchantAccount: string|null, dataSource: string|null} */
    public function status(int $shopId): array
    {
        $connection = $this->credentials->find($shopId);

        return [
            'connected' => null !== $connection && !empty($connection['refresh_token']),
            'googleEmail' => null === $connection ? null : $connection['google_email'],
            'merchantAccount' => null === $connection ? null : $connection['merchant_account'],
            'dataSource' => null === $connection ? null : $connection['data_source'],
        ];
    }

    public function disconnect(int $shopId): void
    {
        $connection = $this->credentials->find($shopId);
        if (null === $connection) {
            unset($this->accessTokens[$shopId]);

            return;
        }

        $refreshToken = $connection['refresh_token'] ?? null;
        if (is_string($refreshToken) && '' !== $refreshToken) {
            try {
                $this->client->revoke($refreshToken);
            } catch (GoogleApiException $exception) {
                unset($exception);
            }
        }

        $this->credentials->delete($shopId);
        unset($this->accessTokens[$shopId]);
    }

    /** @return array<string, mixed> */
    private function requireConfiguration(int $shopId): array
    {
        $connection = $this->credentials->find($shopId);
        if (null === $connection
            || empty($connection['client_id'])
            || empty($connection['client_secret'])
        ) {
            throw new GoogleApiException('Google OAuth is not configured.');
        }

        return $connection;
    }

    private function cacheAccessToken(int $shopId, TokenSet $tokens): void
    {
        $this->accessTokens[$shopId] = [
            'access_token' => $tokens->accessToken(),
            'expires_at' => time() + max(1, $tokens->expiresIn() - self::TOKEN_EXPIRY_SAFETY_SECONDS),
        ];
    }
}
