<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use Symfony\Component\Yaml\Yaml;

class ProductSyncServiceConfigurationTest extends TestCase
{
    public function testAdminLocalApiInjectsSyncProcessorAfterMerchantService(): void
    {
        if (!class_exists(Yaml::class)) {
            self::markTestSkipped('Symfony YAML is provided by the PrestaShop runtime.');
        }
        $admin = Yaml::parseFile(dirname(__DIR__, 3) . '/config/admin/services.yml');

        self::assertSame([
            '@PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository',
            '@PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService',
            '@PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthRedirectUriResolver',
            null,
            null,
            '@PrestaShop\Module\PsxMarketingWithGoogle\Merchant\MerchantAccountService',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncProcessor',
        ], $admin['services']['PrestaShop\Module\PsxMarketingWithGoogle\Api\LocalGoogleApi']['arguments']);
    }

    public function testServiceFileDeclaresExplicitRuntimeAndFilterDependencies(): void
    {
        $content = file_get_contents(dirname(__DIR__, 3) . '/config/admin/product_sync.yml');
        self::assertIsString($content);
        self::assertStringContainsString('DetachedCatalogContextFactory:', $content);
        self::assertStringContainsString('LegacyPrestaShopProductCoreAdapter:', $content);
        self::assertStringContainsString('PrestaShopProductCoreAdapterInterface:', $content);
        self::assertStringContainsString('ConfigurationCatalogFilterSettings:', $content);
        self::assertStringContainsString('CatalogFilterSettingsInterface:', $content);
    }

    public function testAdminImportsTheParsedProductSyncServiceGraph(): void
    {
        if (!class_exists(Yaml::class)) {
            self::markTestSkipped('Symfony YAML is provided by the PrestaShop runtime.');
        }
        $moduleRoot = dirname(__DIR__, 3);
        $admin = Yaml::parseFile($moduleRoot . '/config/admin/services.yml');
        $productSync = Yaml::parseFile($moduleRoot . '/config/admin/product_sync.yml');

        $resources = array_map(static function (array $import): string {
            return $import['resource'];
        }, $admin['imports']);
        self::assertSame(1, count(array_keys($resources, 'product_sync.yml', true)));

        $services = $productSync['services'];
        self::assertSame([
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\DetachedCatalogContextFactory',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopProductCoreAdapterInterface',
        ], $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\LegacyPrestaShopProductRuntime']['arguments']);
        self::assertSame(
            'PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\LegacyPrestaShopProductCoreAdapter',
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopProductCoreAdapterInterface']['alias']
        );
        self::assertSame([
            '@psxmarketingwithgoogle.context',
            '@psxmarketingwithgoogle.link',
            '@psxmarketingwithgoogle.db',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopProductRuntimeInterface',
        ], $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopCatalogGateway']['arguments']);
        self::assertSame(
            'PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopCatalogProductProvider',
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductProviderInterface']['alias']
        );
        self::assertSame([
            '@PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\FilterValidator',
        ], $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ConfigurationCatalogFilterSettings']['arguments']);
        self::assertSame(
            'PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ConfigurationCatalogFilterSettings',
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogFilterSettingsInterface']['alias']
        );
        self::assertSame([
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductProviderInterface',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogFilterSettingsInterface',
        ], $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductSource']['arguments']);
        self::assertTrue($services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductSource']['public']);
        self::assertSame(
            'PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductSource',
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogOfferSourceInterface']['alias']
        );
        self::assertSame(
            ['@psxmarketingwithgoogle.db'],
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobRepository']['arguments']
        );
        self::assertSame(
            'PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobRepository',
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobStoreInterface']['alias']
        );
        self::assertSame(
            'PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService',
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\GoogleConnectionProviderInterface']['alias']
        );
        self::assertSame(
            'PrestaShop\Module\PsxMarketingWithGoogle\Merchant\MerchantApiClient',
            $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductGatewayInterface']['alias']
        );
        self::assertSame([
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobStoreInterface',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogOfferSourceInterface',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\GoogleConnectionProviderInterface',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductGatewayInterface',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductMapper',
            '@psxmarketingwithgoogle.context',
        ], $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncProcessor']['arguments']);
        self::assertTrue($services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncProcessor']['public']);
    }
}
