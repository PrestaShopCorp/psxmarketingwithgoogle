<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\OAuth;

use JsonException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleTransportInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use Throwable;

final class GoogleOAuthClient
{
    private const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private const USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';
    private const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';
    private const SCOPE = 'openid email profile https://www.googleapis.com/auth/content';

    /** @var GoogleTransportInterface */
    private $transport;

    public function __construct(GoogleTransportInterface $transport)
    {
        $this->transport = $transport;
    }

    public function authorizationUrl(string $clientId, string $redirectUri, string $state): string
    {
        return self::AUTH_URL . '?' . http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => self::SCOPE,
            'access_type' => 'offline',
            'prompt' => 'consent',
            'state' => $state,
        ], '', '&', PHP_QUERY_RFC3986);
    }

    public function exchangeCode(
        string $clientId,
        string $clientSecret,
        string $code,
        string $redirectUri
    ): TokenSet {
        return $this->tokenRequest([
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'code' => $code,
            'grant_type' => 'authorization_code',
            'redirect_uri' => $redirectUri,
        ]);
    }

    public function refresh(string $clientId, string $clientSecret, string $refreshToken): TokenSet
    {
        return $this->tokenRequest([
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'refresh_token' => $refreshToken,
            'grant_type' => 'refresh_token',
        ]);
    }

    /** @return array<string, mixed> */
    public function userInfo(string $accessToken): array
    {
        $response = $this->request(
            'GET',
            self::USERINFO_URL,
            ['Authorization: Bearer ' . $accessToken],
            null
        );
        $profile = $this->decodeJson($response);
        $email = $profile['email'] ?? null;
        if (!is_string($email)
            || false === filter_var($email, FILTER_VALIDATE_EMAIL)
            || true !== ($profile['email_verified'] ?? null)
        ) {
            throw new GoogleApiException('Google returned an invalid user profile.');
        }

        return $profile;
    }

    public function revoke(string $token): void
    {
        $this->request(
            'POST',
            self::REVOKE_URL,
            ['Content-Type: application/x-www-form-urlencoded'],
            http_build_query(['token' => $token], '', '&', PHP_QUERY_RFC3986)
        );
    }

    /** @param array<string, string> $parameters */
    private function tokenRequest(array $parameters): TokenSet
    {
        $response = $this->request(
            'POST',
            self::TOKEN_URL,
            ['Content-Type: application/x-www-form-urlencoded'],
            http_build_query($parameters, '', '&', PHP_QUERY_RFC3986)
        );
        $payload = $this->decodeJson($response);
        $accessToken = $payload['access_token'] ?? null;
        $expiresIn = $payload['expires_in'] ?? null;
        $refreshToken = $payload['refresh_token'] ?? null;
        if (!is_string($accessToken) || '' === $accessToken
            || !is_int($expiresIn) || 0 >= $expiresIn
            || (null !== $refreshToken && (!is_string($refreshToken) || '' === $refreshToken))
        ) {
            throw new GoogleApiException('Google returned an invalid response.');
        }

        return new TokenSet($accessToken, $expiresIn, $refreshToken);
    }

    private function request(string $method, string $url, array $headers, ?string $body): Response
    {
        try {
            $response = $this->transport->request($method, $url, $headers, $body);
        } catch (Throwable $exception) {
            unset($exception);

            throw new GoogleApiException('Google OAuth request failed.', true);
        }

        $statusCode = (int) $response->getStatusCode();
        if (null !== $response->getError() || 200 > $statusCode || 299 < $statusCode) {
            throw new GoogleApiException('Google OAuth request failed.', 0 === $statusCode || 429 === $statusCode || 500 <= $statusCode);
        }

        return $response;
    }

    /** @return array<string, mixed> */
    private function decodeJson(Response $response): array
    {
        try {
            $payload = json_decode($response->getBody(), true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            unset($exception);

            throw new GoogleApiException('Google returned an invalid response.');
        }

        if (!is_array($payload)) {
            throw new GoogleApiException('Google returned an invalid response.');
        }

        return $payload;
    }
}
