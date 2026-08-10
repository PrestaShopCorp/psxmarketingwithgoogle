<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\OAuth;

use Throwable;

final class GoogleOAuthCallback
{
    /** @var OAuthStateRepository */
    private $states;

    /** @var GoogleConnectionService */
    private $connections;

    /** @var GoogleOAuthRedirectUriResolver */
    private $redirectUris;

    public function __construct(
        OAuthStateRepository $states,
        GoogleConnectionService $connections,
        GoogleOAuthRedirectUriResolver $redirectUris
    ) {
        $this->states = $states;
        $this->connections = $connections;
        $this->redirectUris = $redirectUris;
    }

    /**
     * @param array<string, mixed> $query
     */
    public function handle(array $query, string $backOfficeUrl): string
    {
        if (array_key_exists('id_shop', $query)) {
            return $this->redirect($backOfficeUrl, 'invalid_request');
        }

        $state = $this->stringValue($query, 'state');
        if (null === $state) {
            return $this->redirect($backOfficeUrl, 'invalid_request');
        }

        try {
            $context = $this->states->findPendingContext($state);
            $shopId = $context['id_shop'];
            $error = $this->stringValue($query, 'error');
            if ('access_denied' === $error) {
                $this->states->consume($state, $shopId);

                return $this->redirect($backOfficeUrl, 'denied');
            }
            if (null !== $error) {
                $this->states->consume($state, $shopId);

                return $this->redirect($backOfficeUrl, 'failed');
            }

            $code = $this->stringValue($query, 'code');
            if (null === $code) {
                $this->states->consume($state, $shopId);

                return $this->redirect($backOfficeUrl, 'invalid_request');
            }

            $this->connections->complete(
                $shopId,
                $state,
                $code,
                $this->redirectUris->resolve($shopId)
            );

            return $this->redirect($backOfficeUrl, 'connected');
        } catch (Throwable $exception) {
            unset($exception);

            return $this->redirect($backOfficeUrl, 'failed');
        }
    }

    /** @param array<string, mixed> $query */
    private function stringValue(array $query, string $key): ?string
    {
        $value = $query[$key] ?? null;
        if (!is_string($value) || '' === trim($value)) {
            return null;
        }

        return $value;
    }

    private function redirect(string $backOfficeUrl, string $result): string
    {
        return $backOfficeUrl
            . (false === strpos($backOfficeUrl, '?') ? '?' : '&')
            . http_build_query(['oauth_result' => $result], '', '&', PHP_QUERY_RFC3986);
    }
}
