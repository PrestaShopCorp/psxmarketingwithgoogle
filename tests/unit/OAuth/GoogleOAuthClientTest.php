<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Google;

final class CurlTestRuntime
{
    /** @var array<int, mixed> */
    public static $options = [];

    public static function reset(): void
    {
        self::$options = [];
    }
}

function curl_init()
{
    return new \stdClass();
}

function curl_setopt_array($handle, array $options): bool
{
    unset($handle);
    CurlTestRuntime::$options = $options;

    return true;
}

function curl_setopt($handle, int $option, $value): bool
{
    unset($handle);
    CurlTestRuntime::$options[$option] = $value;

    return true;
}

function curl_exec($handle)
{
    unset($handle);

    return '{"ok":true}';
}

function curl_getinfo($handle, int $option): int
{
    unset($handle, $option);

    return 200;
}

function curl_error($handle): string
{
    unset($handle);

    return '';
}

function curl_close($handle): void
{
    unset($handle);
}

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\OAuth;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\CurlGoogleTransport;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\CurlTestRuntime;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleTransportInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthClient;

class GoogleOAuthClientTest extends TestCase
{
    private const REDIRECT_URI = 'https://thetinylux.com/module/tlgoogleshopping/oauth';

    public function testAuthorizationUrlRequestsOfflineMerchantAccess(): void
    {
        $client = new GoogleOAuthClient(new RecordingGoogleTransport());

        $url = $client->authorizationUrl('client-id', self::REDIRECT_URI, 'state-value');
        parse_str((string) parse_url($url, PHP_URL_QUERY), $query);

        self::assertSame('https://accounts.google.com/o/oauth2/v2/auth', strtok($url, '?'));
        self::assertSame('client-id', $query['client_id']);
        self::assertSame(self::REDIRECT_URI, $query['redirect_uri']);
        self::assertSame('offline', $query['access_type']);
        self::assertSame('consent', $query['prompt']);
        self::assertSame('code', $query['response_type']);
        self::assertSame('state-value', $query['state']);
        self::assertSame(
            'openid email profile https://www.googleapis.com/auth/content',
            $query['scope']
        );
    }

    public function testCodeExchangeUsesExactRedirectAndAuthorizationCodeContract(): void
    {
        $transport = new RecordingGoogleTransport([
            new Response(200, '{"access_token":"access-value","expires_in":3600,"refresh_token":"refresh-value","token_type":"Bearer"}'),
        ]);
        $client = new GoogleOAuthClient($transport);

        $tokens = $client->exchangeCode(
            'client-id',
            'client-secret-value',
            'authorization-code-value',
            self::REDIRECT_URI
        );

        self::assertSame('access-value', $tokens->accessToken());
        self::assertSame('refresh-value', $tokens->refreshToken());
        self::assertSame(3600, $tokens->expiresIn());
        self::assertCount(1, $transport->requests);
        self::assertSame('POST', $transport->requests[0]['method']);
        self::assertSame('https://oauth2.googleapis.com/token', $transport->requests[0]['url']);
        self::assertSame(['Content-Type: application/x-www-form-urlencoded'], $transport->requests[0]['headers']);
        parse_str((string) $transport->requests[0]['body'], $body);
        self::assertSame([
            'client_id' => 'client-id',
            'client_secret' => 'client-secret-value',
            'code' => 'authorization-code-value',
            'grant_type' => 'authorization_code',
            'redirect_uri' => self::REDIRECT_URI,
        ], $body);
    }

    public function testRefreshRequestReturnsNoReplacementRefreshTokenWhenGoogleOmitsIt(): void
    {
        $transport = new RecordingGoogleTransport([
            new Response(200, '{"access_token":"new-access-value","expires_in":1800,"token_type":"Bearer"}'),
        ]);
        $client = new GoogleOAuthClient($transport);

        $tokens = $client->refresh('client-id', 'client-secret-value', 'old-refresh-value');

        self::assertSame('new-access-value', $tokens->accessToken());
        self::assertNull($tokens->refreshToken());
        parse_str((string) $transport->requests[0]['body'], $body);
        self::assertSame([
            'client_id' => 'client-id',
            'client_secret' => 'client-secret-value',
            'refresh_token' => 'old-refresh-value',
            'grant_type' => 'refresh_token',
        ], $body);
    }

    public function testMalformedJsonIsConvertedToSanitizedGoogleApiException(): void
    {
        $rawBody = '{broken-json-client-secret-value';
        $client = new GoogleOAuthClient(new RecordingGoogleTransport([
            new Response(200, $rawBody),
        ]));

        try {
            $client->exchangeCode('client-id', 'client-secret-value', 'code-value', self::REDIRECT_URI);
            self::fail('Malformed Google JSON must be rejected.');
        } catch (GoogleApiException $exception) {
            self::assertSame('Google returned an invalid response.', $exception->getMessage());
            self::assertNull($exception->getPrevious());
            self::assertStringNotContainsString($rawBody, $exception->getMessage());
            self::assertStringNotContainsString('client-secret-value', $exception->getMessage());
            self::assertStringNotContainsString('code-value', $exception->getMessage());
        }
    }

    public function testNonSuccessAndTransportErrorsDoNotExposeGoogleResponseOrCredentials(): void
    {
        $sensitiveBody = '{"error":"invalid_grant","error_description":"refresh-token-value client-secret-value"}';
        $responses = [
            new Response(401, $sensitiveBody),
            new Response(0, '', [], 'curl failed while sending refresh-token-value'),
        ];

        foreach ($responses as $response) {
            $client = new GoogleOAuthClient(new RecordingGoogleTransport([$response]));
            try {
                $client->refresh('client-id', 'client-secret-value', 'refresh-token-value');
                self::fail('A failed Google request must throw.');
            } catch (GoogleApiException $exception) {
                self::assertSame('Google OAuth request failed.', $exception->getMessage());
                self::assertNull($exception->getPrevious());
                self::assertStringNotContainsString($sensitiveBody, $exception->getMessage());
                self::assertStringNotContainsString('refresh-token-value', $exception->getMessage());
                self::assertStringNotContainsString('client-secret-value', $exception->getMessage());
            }
        }
    }

    public function testUserInfoRequiresAValidVerifiedEmail(): void
    {
        $invalidProfiles = [
            '{"sub":"123","email":"not-an-email","email_verified":true}',
            '{"sub":"123","email":"owner@example.com","email_verified":false}',
            '{"sub":"123","email_verified":true}',
        ];

        foreach ($invalidProfiles as $profile) {
            $client = new GoogleOAuthClient(new RecordingGoogleTransport([new Response(200, $profile)]));
            try {
                $client->userInfo('access-token-value');
                self::fail('Google user info must contain a valid verified email.');
            } catch (GoogleApiException $exception) {
                self::assertSame('Google returned an invalid user profile.', $exception->getMessage());
                self::assertStringNotContainsString('access-token-value', $exception->getMessage());
            }
        }

        $transport = new RecordingGoogleTransport([
            new Response(200, '{"sub":"123","email":"owner@example.com","email_verified":true,"name":"Owner"}'),
        ]);
        $profile = (new GoogleOAuthClient($transport))->userInfo('access-token-value');
        self::assertSame('owner@example.com', $profile['email']);
        self::assertSame('GET', $transport->requests[0]['method']);
        self::assertSame('https://openidconnect.googleapis.com/v1/userinfo', $transport->requests[0]['url']);
        self::assertSame(['Authorization: Bearer access-token-value'], $transport->requests[0]['headers']);
        self::assertNull($transport->requests[0]['body']);
    }

    public function testRevocationUsesGoogleEndpointWithoutPuttingTokenInTheUrl(): void
    {
        $transport = new RecordingGoogleTransport([new Response(200, '')]);

        (new GoogleOAuthClient($transport))->revoke('refresh-token-value');

        self::assertSame('POST', $transport->requests[0]['method']);
        self::assertSame('https://oauth2.googleapis.com/revoke', $transport->requests[0]['url']);
        self::assertStringNotContainsString('refresh-token-value', $transport->requests[0]['url']);
        parse_str((string) $transport->requests[0]['body'], $body);
        self::assertSame(['token' => 'refresh-token-value'], $body);
    }

    public function testCurlTransportEnforcesTlsAndBoundedTimeoutsWithoutVerboseLogging(): void
    {
        CurlTestRuntime::reset();

        $response = (new CurlGoogleTransport())->request(
            'POST',
            'https://oauth2.googleapis.com/token',
            ['Content-Type: application/x-www-form-urlencoded'],
            'client_secret=secret-value'
        );

        self::assertSame(200, $response->getStatusCode());
        self::assertTrue(CurlTestRuntime::$options[CURLOPT_SSL_VERIFYPEER]);
        self::assertSame(2, CurlTestRuntime::$options[CURLOPT_SSL_VERIFYHOST]);
        self::assertGreaterThan(0, CurlTestRuntime::$options[CURLOPT_CONNECTTIMEOUT]);
        self::assertLessThanOrEqual(10, CurlTestRuntime::$options[CURLOPT_CONNECTTIMEOUT]);
        self::assertGreaterThan(0, CurlTestRuntime::$options[CURLOPT_TIMEOUT]);
        self::assertLessThanOrEqual(30, CurlTestRuntime::$options[CURLOPT_TIMEOUT]);
        self::assertSame(CURLPROTO_HTTPS, CurlTestRuntime::$options[CURLOPT_PROTOCOLS]);
        self::assertArrayNotHasKey(CURLOPT_VERBOSE, CurlTestRuntime::$options);
        self::assertSame('client_secret=secret-value', CurlTestRuntime::$options[CURLOPT_POSTFIELDS]);
    }
}

final class RecordingGoogleTransport implements GoogleTransportInterface
{
    /** @var Response[] */
    private $responses;

    /** @var array<int, array{method: string, url: string, headers: array<int, string>, body: string|null}> */
    public $requests = [];

    /**
     * @param Response[] $responses
     */
    public function __construct(array $responses = [])
    {
        $this->responses = $responses;
    }

    public function request(string $method, string $url, array $headers, ?string $body): Response
    {
        $this->requests[] = compact('method', 'url', 'headers', 'body');

        if ([] === $this->responses) {
            return new Response(500, 'No fake response configured.');
        }

        return array_shift($this->responses);
    }
}
