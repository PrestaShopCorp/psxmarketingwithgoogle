<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Api;

use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthRedirectUriResolver;
use Throwable;

final class LocalGoogleApi
{
    public const CLIENT_ID_SUFFIX_LENGTH = 8;

    private const MAX_CLIENT_ID_BYTES = 2048;
    private const MAX_CLIENT_SECRET_BYTES = 4096;
    private const MAX_REDIRECT_URI_BYTES = 2048;
    private const MAX_REDIRECT_URIS = 20;

    private const ROUTES = [
        'GET settings/status' => 'settingsStatus',
        'POST settings/credentials' => 'saveCredentials',
        'GET oauth/authorized-url' => 'authorizationUrl',
        'GET oauth' => 'connectionStatus',
        'DELETE oauth' => 'disconnect',
    ];

    /** @var GoogleCredentialRepository */
    private $credentials;

    /** @var GoogleConnectionService */
    private $connections;

    /** @var GoogleOAuthRedirectUriResolver */
    private $redirectUris;

    /** @var callable|null */
    private $shopIdProvider;

    /** @var callable|null */
    private $employeeIdProvider;

    public function __construct(
        GoogleCredentialRepository $credentials,
        GoogleConnectionService $connections,
        GoogleOAuthRedirectUriResolver $redirectUris,
        ?callable $shopIdProvider = null,
        ?callable $employeeIdProvider = null
    ) {
        $this->credentials = $credentials;
        $this->connections = $connections;
        $this->redirectUris = $redirectUris;
        $this->shopIdProvider = $shopIdProvider;
        $this->employeeIdProvider = $employeeIdProvider;
    }

    /** @param array<string, mixed> $body */
    public function dispatch(string $method, string $path, array $body = []): Response
    {
        $handler = self::ROUTES[$method . ' ' . $path] ?? null;
        if (null === $handler) {
            return $this->error(404, 'route_not_found');
        }

        try {
            return $this->$handler($body);
        } catch (GoogleApiException $exception) {
            unset($exception);

            return $this->error(412, 'google_not_configured');
        } catch (Throwable $exception) {
            unset($exception);

            return $this->error(500, 'internal_error');
        }
    }

    /** @param array<string, mixed> $body */
    private function settingsStatus(array $body): Response
    {
        unset($body);
        $shopId = $this->shopId();
        $connection = $this->credentials->find($shopId);
        $clientId = null === $connection ? null : ($connection['client_id'] ?? null);
        $configured = is_string($clientId) && '' !== trim($clientId)
            && is_string($connection['client_secret'] ?? null)
            && '' !== trim($connection['client_secret']);

        return $this->json(200, [
            'configured' => $configured,
            'clientIdSuffix' => $configured ? $this->clientIdSuffix($clientId) : '',
            'redirectUri' => $this->redirectUris->resolve($shopId),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function saveCredentials(array $body): Response
    {
        if (!$this->validCredentialEnvelope($body)) {
            return $this->error(422, 'invalid_web_client');
        }

        /** @var array<string, mixed> $web */
        $web = $body['web'];
        $clientId = trim($web['client_id']);
        $clientSecret = $web['client_secret'];
        $shopId = $this->shopId();
        $redirectUri = $this->redirectUris->resolve($shopId);
        if (!in_array($redirectUri, $web['redirect_uris'], true)) {
            return $this->error(422, 'invalid_web_client');
        }

        $this->credentials->save($shopId, [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
        ]);

        return $this->json(200, [
            'configured' => true,
            'clientIdSuffix' => $this->clientIdSuffix($clientId),
            'redirectUri' => $redirectUri,
        ]);
    }

    /** @param array<string, mixed> $body */
    private function authorizationUrl(array $body): Response
    {
        unset($body);
        $shopId = $this->shopId();

        return $this->json(200, [
            'authorizedUrl' => $this->connections->authorizationUrl(
                $shopId,
                $this->employeeId(),
                $this->redirectUris->resolve($shopId)
            ),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function connectionStatus(array $body): Response
    {
        unset($body);

        return $this->json(200, $this->connections->status($this->shopId()));
    }

    /** @param array<string, mixed> $body */
    private function disconnect(array $body): Response
    {
        unset($body);
        $this->connections->disconnect($this->shopId());

        return $this->json(200, ['connected' => false]);
    }

    /** @param array<string, mixed> $body */
    private function validCredentialEnvelope(array $body): bool
    {
        if (['web'] !== array_keys($body) || !is_array($body['web']) || array_is_list($body['web'])) {
            return false;
        }
        $web = $body['web'];
        $clientId = $web['client_id'] ?? null;
        $clientSecret = $web['client_secret'] ?? null;
        $redirectUris = $web['redirect_uris'] ?? null;
        if (!is_string($clientId) || '' === trim($clientId) || self::MAX_CLIENT_ID_BYTES < strlen($clientId)
            || !is_string($clientSecret) || '' === trim($clientSecret) || self::MAX_CLIENT_SECRET_BYTES < strlen($clientSecret)
            || !is_array($redirectUris) || !array_is_list($redirectUris)
            || 0 === count($redirectUris) || self::MAX_REDIRECT_URIS < count($redirectUris)
        ) {
            return false;
        }
        foreach ($redirectUris as $redirectUri) {
            if (!is_string($redirectUri) || '' === $redirectUri
                || self::MAX_REDIRECT_URI_BYTES < strlen($redirectUri)
            ) {
                return false;
            }
        }

        return true;
    }

    private function shopId(): int
    {
        $shopId = null === $this->shopIdProvider
            ? (int) \Context::getContext()->shop->id
            : (int) call_user_func($this->shopIdProvider);
        if (0 >= $shopId) {
            throw new \UnexpectedValueException('Active shop context is unavailable.');
        }

        return $shopId;
    }

    private function employeeId(): int
    {
        $employeeId = null === $this->employeeIdProvider
            ? (int) \Context::getContext()->employee->id
            : (int) call_user_func($this->employeeIdProvider);
        if (0 >= $employeeId) {
            throw new \UnexpectedValueException('Active employee context is unavailable.');
        }

        return $employeeId;
    }

    private function clientIdSuffix(string $clientId): string
    {
        return substr($clientId, -self::CLIENT_ID_SUFFIX_LENGTH);
    }

    /** @param array<string, mixed> $payload */
    private function json(int $statusCode, array $payload): Response
    {
        $body = json_encode($payload, JSON_UNESCAPED_SLASHES);
        if (!is_string($body)) {
            return $this->error(500, 'internal_error');
        }

        return new Response($statusCode, $body, [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
        ]);
    }

    private function error(int $statusCode, string $code): Response
    {
        return new Response($statusCode, '{"code":"' . $code . '"}', [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
        ]);
    }
}
