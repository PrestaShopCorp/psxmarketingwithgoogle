<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\AttributeType;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Condition;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\FilterValidator;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ConfigurationCatalogFilterSettings;
use RuntimeException;

class ConfigurationCatalogFilterSettingsTest extends TestCase
{
    private const CONFIGURATION_KEY = 'PSX_MKTG_WITH_GOOGLE_PRODUCT_FILTERS';

    public function testReadsValidatedFiltersWithAnExplicitShopIdEveryTime(): void
    {
        $shopOne = $this->validFilters(42);
        $shopTwo = $this->validFilters(84);
        $configuration = new RecordingConfigurationAdapter([
            1 => json_encode($shopOne),
            2 => json_encode($shopTwo),
        ]);
        $settings = new ConfigurationCatalogFilterSettings($configuration, new FilterValidator());

        self::assertSame($shopOne, $settings->filtersForShop(1));
        self::assertSame($shopTwo, $settings->filtersForShop(2));
        self::assertSame([
            [self::CONFIGURATION_KEY, null, null, 1, false],
            [self::CONFIGURATION_KEY, null, null, 2, false],
        ], $configuration->getCalls);
    }

    public function testMissingShopScopedSettingMeansNoFilters(): void
    {
        $configuration = new RecordingConfigurationAdapter([]);
        $settings = new ConfigurationCatalogFilterSettings($configuration, new FilterValidator());

        self::assertSame([], $settings->filtersForShop(3));
        self::assertSame([[self::CONFIGURATION_KEY, null, null, 3, false]], $configuration->getCalls);
    }

    /**
     * @dataProvider malformedStoredFilterProvider
     */
    public function testFailsClosedWithASanitizedErrorForMalformedStoredFilters($stored): void
    {
        $configuration = new RecordingConfigurationAdapter([7 => $stored]);
        $settings = new ConfigurationCatalogFilterSettings($configuration, new FilterValidator());

        try {
            $settings->filtersForShop(7);
            self::fail('Malformed persisted filters must never broaden synchronization to every product.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame('Stored product filters are invalid.', $exception->getMessage());
            self::assertStringNotContainsString((string) $stored, $exception->getMessage());
        }
    }

    public function malformedStoredFilterProvider(): array
    {
        return [
            'invalid JSON' => ['{"attribute":'],
            'object instead of canonical list' => ['{"0":{"attribute":"id","condition":"is","value":[42]}}'],
            'missing required shape field' => ['[{"attribute":"id","value":[42]}]'],
            'unknown shape field' => ['[{"attribute":"id","condition":"is","value":[42],"raw":"SQL"}]'],
            'invalid filter value' => ['[{"attribute":"id","condition":"is","value":["42"]}]'],
            'non-string configuration value' => [true],
            'over size bound' => [str_repeat(' ', 65537)],
            'over depth bound' => [str_repeat('[', 18) . '0' . str_repeat(']', 18)],
        ];
    }

    public function testReplacesFiltersUsingCanonicalJsonAndExplicitShopId(): void
    {
        $configuration = new RecordingConfigurationAdapter([]);
        $settings = new ConfigurationCatalogFilterSettings($configuration, new FilterValidator());
        $filters = $this->validFilters(42);

        $settings->replaceForShop(9, $filters);

        self::assertSame([
            [self::CONFIGURATION_KEY, json_encode($filters), false, null, 9],
        ], $configuration->updateCalls);
    }

    public function testRejectsMalformedReplacementBeforeWriting(): void
    {
        $configuration = new RecordingConfigurationAdapter([]);
        $settings = new ConfigurationCatalogFilterSettings($configuration, new FilterValidator());

        try {
            $settings->replaceForShop(9, [['attribute' => AttributeType::PRODUCT_ID]]);
            self::fail('Malformed replacement filters must be rejected.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame('Product filters are invalid.', $exception->getMessage());
            self::assertSame([], $configuration->updateCalls);
        }
    }

    public function testReportsAWriteFailureWithoutLeakingFilterValues(): void
    {
        $configuration = new RecordingConfigurationAdapter([]);
        $configuration->updateResult = false;
        $settings = new ConfigurationCatalogFilterSettings($configuration, new FilterValidator());

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Unable to persist product filters.');

        $settings->replaceForShop(9, $this->validFilters(42));
    }

    /** @return array<int, array<string, mixed>> */
    private function validFilters(int $productId): array
    {
        return [[
            'attribute' => AttributeType::PRODUCT_ID,
            'condition' => Condition::IS,
            'value' => [$productId],
        ]];
    }
}

class RecordingConfigurationAdapter extends ConfigurationAdapter
{
    /** @var array<int, mixed> */
    private $valuesByShop;

    /** @var array<int, array<int, mixed>> */
    public $getCalls = [];

    /** @var array<int, array<int, mixed>> */
    public $updateCalls = [];

    /** @var bool */
    public $updateResult = true;

    public function __construct(array $valuesByShop)
    {
        parent::__construct(999);
        $this->valuesByShop = $valuesByShop;
    }

    public function get($key, $idLang = null, $idShopGroup = null, $idShop = null, $default = false)
    {
        $this->getCalls[] = [$key, $idLang, $idShopGroup, $idShop, $default];

        return $this->valuesByShop[$idShop] ?? $default;
    }

    public function updateValue($key, $values, $html = false, $idShopGroup = null, $idShop = null)
    {
        $this->updateCalls[] = [$key, $values, $html, $idShopGroup, $idShop];

        return $this->updateResult;
    }
}
