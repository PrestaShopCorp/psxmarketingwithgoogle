<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use Symfony\Component\Yaml\Yaml;

class ProductSyncServiceConfigurationTest extends TestCase
{
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
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductProviderInterface',
            '@PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductMapper',
        ], $services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductSource']['arguments']);
        self::assertTrue($services['PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductSource']['public']);
    }
}
