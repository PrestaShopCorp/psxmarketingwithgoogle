<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\OAuth;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthRedirectUriResolver;
use UnexpectedValueException;

class GoogleOAuthRedirectUriResolverTest extends TestCase
{
    public function testProductionShopResolvesToExactCallbackAndIgnoresRequestHosts(): void
    {
        $originalServer = $_SERVER;
        $_SERVER['HTTP_HOST'] = 'attacker.example';
        $_SERVER['HTTP_X_FORWARDED_HOST'] = 'other-attacker.example';

        try {
            $resolver = $this->resolver([
                1 => ['domain_ssl' => 'thetinylux.com', 'physical_uri' => '/', 'virtual_uri' => ''],
            ]);

            self::assertSame(
                'https://thetinylux.com/module/tlgoogleshopping/oauth',
                $resolver->resolve(1)
            );
        } finally {
            $_SERVER = $originalServer;
        }
    }

    public function testStateOrActiveShopIdSelectsItsTrustedConfiguredDomainAndNormalizedBasePath(): void
    {
        $resolver = $this->resolver([
            1 => ['domain_ssl' => 'thetinylux.com', 'physical_uri' => '/', 'virtual_uri' => ''],
            2 => [
                'domain_ssl' => 'preview.trycloudflare.com',
                'physical_uri' => '//prestashop///',
                'virtual_uri' => '//en///',
            ],
        ]);

        self::assertSame(
            'https://thetinylux.com/module/tlgoogleshopping/oauth',
            $resolver->resolve(1)
        );
        self::assertSame(
            'https://preview.trycloudflare.com/prestashop/en/module/tlgoogleshopping/oauth',
            $resolver->resolve(2)
        );
    }

    /**
     * @dataProvider invalidTrustedShopProvider
     *
     * @param array<string, mixed> $shop
     */
    public function testInvalidTrustedDomainOrTraversingBasePathIsRejected(array $shop): void
    {
        $resolver = $this->resolver([1 => $shop]);

        $this->expectException(UnexpectedValueException::class);
        $this->expectExceptionMessage('Google OAuth redirect URI is unavailable.');
        $resolver->resolve(1);
    }

    /** @return array<string, array{0: array<string, mixed>}> */
    public function invalidTrustedShopProvider(): array
    {
        return [
            'missing domain' => [[
                'domain_ssl' => '', 'physical_uri' => '/', 'virtual_uri' => '',
            ]],
            'domain with scheme' => [[
                'domain_ssl' => 'https://thetinylux.com', 'physical_uri' => '/', 'virtual_uri' => '',
            ]],
            'domain with path' => [[
                'domain_ssl' => 'thetinylux.com/evil', 'physical_uri' => '/', 'virtual_uri' => '',
            ]],
            'domain with credentials' => [[
                'domain_ssl' => 'user@thetinylux.com', 'physical_uri' => '/', 'virtual_uri' => '',
            ]],
            'domain with invalid port' => [[
                'domain_ssl' => 'thetinylux.com:70000', 'physical_uri' => '/', 'virtual_uri' => '',
            ]],
            'physical traversal' => [[
                'domain_ssl' => 'thetinylux.com', 'physical_uri' => '/../admin/', 'virtual_uri' => '',
            ]],
            'encoded virtual traversal' => [[
                'domain_ssl' => 'thetinylux.com', 'physical_uri' => '/', 'virtual_uri' => '%2e%2e/admin/',
            ]],
            'query in base path' => [[
                'domain_ssl' => 'thetinylux.com', 'physical_uri' => '/shop?evil=1', 'virtual_uri' => '',
            ]],
        ];
    }

    /**
     * @param array<int, array<string, mixed>> $shops
     */
    private function resolver(array $shops): GoogleOAuthRedirectUriResolver
    {
        return new GoogleOAuthRedirectUriResolver(static function (int $shopId) use ($shops): array {
            return $shops[$shopId] ?? [];
        });
    }
}
