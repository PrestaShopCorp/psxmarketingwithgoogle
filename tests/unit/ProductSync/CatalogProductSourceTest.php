<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use InvalidArgumentException;
use LogicException;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\AttributeType;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Condition;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogFilterSettingsInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProduct;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductProviderInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductSource;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ProductValidationException;

class CatalogProductSourceTest extends TestCase
{
    public function testHydratesTheAlreadyFlattenedOfferPageInCanonicalOrder(): void
    {
        $enumerator = new RecordingProductOfferEnumerator([[10, 0], [20, 3], [20, 13]]);
        $provider = new RecordingCatalogProvider();
        $source = $this->source($enumerator, $provider);

        $products = $source->page(1, 2, 0, 10);

        self::assertSame(['10-0', '20-3', '20-13'], $this->offerIds($products));
        self::assertSame([[10, 0], [20, 3], [20, 13]], $provider->hydrations);
        self::assertSame([], $provider->combinationCalls);
        self::assertSame(0, $enumerator->legacyCalls);
    }

    public function testSequentialPagesUseOneDirectQueryEachWithoutPrefixRescans(): void
    {
        $enumerator = new RecordingProductOfferEnumerator([
            [10, 0], [20, 4], [20, 7], [20, 9], [30, 0],
        ]);
        $source = $this->source($enumerator, new RecordingCatalogProvider());

        self::assertSame(['10-0', '20-4'], $this->offerIds($source->page(1, 2, 0, 2)));
        self::assertSame(['20-7', '20-9'], $this->offerIds($source->page(1, 2, 2, 2)));
        self::assertSame(['30-0'], $this->offerIds($source->page(1, 2, 4, 2)));
        self::assertSame([0, 2, 4], array_column(array_column($enumerator->calls, 'pagination'), 'offset'));
        self::assertSame([2, 2, 2], array_column(array_column($enumerator->calls, 'pagination'), 'limit'));
        self::assertSame(3, count($enumerator->calls));
        self::assertSame(0, $enumerator->legacyCalls);
    }

    public function testReadsPersistedFiltersForTheExplicitShopOnEveryPage(): void
    {
        $filters = [[
            'attribute' => AttributeType::PRODUCT_ID,
            'condition' => Condition::IS,
            'value' => [42],
        ]];
        $settings = new RecordingCatalogFilterSettings([1 => $filters]);
        $enumerator = new RecordingProductOfferEnumerator([[42, 0]]);
        $source = $this->source($enumerator, new RecordingCatalogProvider(), $settings);

        self::assertSame(['42-0'], $this->offerIds($source->page(1, 2, 0, 1)));
        self::assertSame([1], $settings->readShopIds);
        self::assertSame($filters, $enumerator->calls[0]['filters']);
    }

    public function testLeavesMerchantFieldValidationToPerItemMapping(): void
    {
        $enumerator = new RecordingProductOfferEnumerator([[42, 0]]);
        $invalidMerchantProduct = RecordingCatalogProvider::catalogProduct(
            42,
            0,
            'https://thetinylux.com/products/42',
            'https://thetinylux.com/img/42.jpg',
            '',
            'not-a-decimal'
        );
        $provider = new RecordingCatalogProvider(static function () use ($invalidMerchantProduct): CatalogProduct {
            return $invalidMerchantProduct;
        });

        self::assertSame(
            [$invalidMerchantProduct],
            $this->source($enumerator, $provider)->page(1, 2, 0, 1)
        );
    }

    public function testRejectsRelativeOrMissingCanonicalUrlsReturnedByTheProvider(): void
    {
        $provider = new RecordingCatalogProvider(static function (int $productId, int $attributeId): CatalogProduct {
            return RecordingCatalogProvider::catalogProduct($productId, $attributeId, '/relative-link', '');
        });
        $source = $this->source(new RecordingProductOfferEnumerator([[42, 0]]), $provider);

        try {
            $source->page(1, 2, 0, 1);
            self::fail('A source must not emit products with untrusted URLs.');
        } catch (ProductValidationException $exception) {
            self::assertContains(['field' => 'link', 'code' => 'invalid_url'], $exception->errors());
            self::assertContains(['field' => 'imageLink', 'code' => 'required'], $exception->errors());
        }
    }

    public function testRejectsNonAsciiOrMalformedRfc3986CatalogUrlsBeforeEmission(): void
    {
        $provider = new RecordingCatalogProvider(static function (int $productId, int $attributeId): CatalogProduct {
            return RecordingCatalogProvider::catalogProduct(
                $productId,
                $attributeId,
                "https://thetinylux.com/caf\u{00E9}",
                'https://thetinylux.com/img/lamp%GG|large.jpg'
            );
        });
        $source = $this->source(new RecordingProductOfferEnumerator([[42, 0]]), $provider);

        try {
            $source->page(1, 2, 0, 1);
            self::fail('A source must not emit non-ASCII or malformed RFC3986 URLs.');
        } catch (ProductValidationException $exception) {
            self::assertSame([
                ['field' => 'link', 'code' => 'invalid_url'],
                ['field' => 'imageLink', 'code' => 'invalid_url'],
            ], $exception->errors());
            self::assertSame('Merchant product validation failed.', $exception->getMessage());
            self::assertStringNotContainsString('caf', $exception->getMessage());
            self::assertStringNotContainsString('%GG', $exception->getMessage());
        }
    }

    public function testRejectsDuplicateOrNonAdvancingFlattenedOfferReferences(): void
    {
        $source = $this->source(
            new RecordingProductOfferEnumerator([[42, 7], [42, 7]]),
            new RecordingCatalogProvider()
        );

        $this->expectException(LogicException::class);
        $this->expectExceptionMessage('Offer enumeration did not advance.');

        $source->page(1, 2, 0, 2);
    }

    public function testAssertsTrustedContextBeforeReadingFiltersOrCatalogData(): void
    {
        $settings = new RecordingCatalogFilterSettings([]);
        $enumerator = new RecordingProductOfferEnumerator([[42, 0]]);
        $provider = new RecordingCatalogProvider(null, 1, 2);
        $source = $this->source($enumerator, $provider, $settings);

        try {
            $source->page(9, 2, 0, 1);
            self::fail('Mismatched shop context must be rejected.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame([], $settings->readShopIds);
            self::assertSame([], $enumerator->calls);
            self::assertSame([], $provider->hydrations);
        }
    }

    /**
     * @dataProvider invalidPageProvider
     */
    public function testValidatesPageArguments(int $shopId, int $languageId, int $offset, int $limit): void
    {
        $source = $this->source(new RecordingProductOfferEnumerator([]), new RecordingCatalogProvider());

        $this->expectException(InvalidArgumentException::class);

        $source->page($shopId, $languageId, $offset, $limit);
    }

    public function invalidPageProvider(): array
    {
        return [
            'zero shop' => [0, 2, 0, 1],
            'zero language' => [1, 0, 0, 1],
            'negative offset' => [1, 2, -1, 1],
            'zero limit' => [1, 2, 0, 0],
            'limit above bound' => [1, 2, 0, 251],
        ];
    }

    private function source(
        ProductEnumerator $enumerator,
        CatalogProductProviderInterface $provider,
        ?RecordingCatalogFilterSettings $settings = null
    ): CatalogProductSource {
        return new CatalogProductSource(
            $enumerator,
            $provider,
            $settings ?? new RecordingCatalogFilterSettings([])
        );
    }

    /** @param CatalogProduct[] $products */
    private function offerIds(array $products): array
    {
        return array_map(static function (CatalogProduct $product): string {
            return $product->offerId();
        }, $products);
    }
}

class RecordingCatalogFilterSettings implements CatalogFilterSettingsInterface
{
    /** @var array<int, array<int, array<string, mixed>>> */
    private $filtersByShop;

    /** @var int[] */
    public $readShopIds = [];

    public function __construct(array $filtersByShop)
    {
        $this->filtersByShop = $filtersByShop;
    }

    public function filtersForShop(int $shopId): array
    {
        $this->readShopIds[] = $shopId;

        return $this->filtersByShop[$shopId] ?? [];
    }

    public function replaceForShop(int $shopId, array $filters): void
    {
        $this->filtersByShop[$shopId] = $filters;
    }
}

class RecordingProductOfferEnumerator extends ProductEnumerator
{
    /** @var array<int, array{0: int, 1: int}> */
    private $offers;

    /** @var array<int, array{filters: array, pagination: array}> */
    public $calls = [];

    /** @var int */
    public $legacyCalls = 0;

    public function __construct(array $offers)
    {
        $this->offers = $offers;
    }

    public function listProductOffersMatchingFilters(array $filters, array $paginationParams): array
    {
        $this->calls[] = ['filters' => $filters, 'pagination' => $paginationParams];

        return array_map(static function (array $offer): array {
            return ['id_product' => $offer[0], 'id_product_attribute' => $offer[1]];
        }, array_slice($this->offers, $paginationParams['offset'], $paginationParams['limit']));
    }

    public function listProductsMatchingFilters(array $filters, array $paginationParams): array
    {
        unset($filters, $paginationParams);
        ++$this->legacyCalls;

        return [];
    }

    public function countProductsMatchingFilters(array $filters): int
    {
        unset($filters);
        ++$this->legacyCalls;

        return 0;
    }
}

class RecordingCatalogProvider implements CatalogProductProviderInterface
{
    /** @var int */
    private $shopId;

    /** @var int */
    private $languageId;

    /** @var callable|null */
    private $factory;

    /** @var array<int, array{0: int, 1: int}> */
    public $hydrations = [];

    /** @var array<int, int> */
    public $combinationCalls = [];

    public function __construct($factory = null, int $shopId = 1, int $languageId = 2)
    {
        $this->factory = $factory;
        $this->shopId = $shopId;
        $this->languageId = $languageId;
    }

    public function assertContext(int $shopId, int $languageId): void
    {
        if ($shopId !== $this->shopId || $languageId !== $this->languageId) {
            throw new InvalidArgumentException('Catalog context is not trusted.');
        }
    }

    public function combinationCounts(int $productId, int $shopId): array
    {
        unset($shopId);
        $this->combinationCalls[] = $productId;

        return ['total' => 0, 'active' => 0];
    }

    public function activeCombinationIds(
        int $productId,
        int $shopId,
        int $languageId,
        int $offset,
        int $limit
    ): array {
        unset($productId, $shopId, $languageId, $offset, $limit);
        ++$this->combinationCalls;

        return [];
    }

    public function product(int $productId, int $attributeId, int $shopId, int $languageId): CatalogProduct
    {
        unset($shopId, $languageId);
        $this->hydrations[] = [$productId, $attributeId];
        if (null !== $this->factory) {
            return ($this->factory)($productId, $attributeId);
        }

        return self::catalogProduct(
            $productId,
            $attributeId,
            'https://thetinylux.com/products/' . $productId . '?attribute=' . $attributeId,
            'https://thetinylux.com/img/' . $productId . '.jpg'
        );
    }

    public static function catalogProduct(
        int $productId,
        int $attributeId,
        string $link,
        string $imageLink,
        string $title = 'Silk Lamp',
        string $price = '449.99'
    ): CatalogProduct {
        return new CatalogProduct(
            $productId . '-' . $attributeId,
            $title,
            'Hand-finished lamp',
            $link,
            $imageLink,
            true,
            $price,
            'EUR',
            null,
            null,
            null
        );
    }
}
