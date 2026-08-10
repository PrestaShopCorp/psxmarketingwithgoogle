<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use InvalidArgumentException;
use LogicException;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProduct;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductProviderInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProductSource;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductMapper;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ProductValidationException;

class CatalogProductSourceTest extends TestCase
{
    public function testReturnsProductsWithoutCombinationsAsAttributeZeroAndEveryActiveVariant(): void
    {
        $enumerator = new RecordingProductEnumerator([10, 20, 30]);
        $provider = new RecordingCatalogProvider([
            10 => ['all' => [], 'active' => []],
            20 => ['all' => [3, 8, 13], 'active' => [3, 13]],
            30 => ['all' => [2], 'active' => []],
        ]);
        $source = $this->source($enumerator, $provider);

        $products = $source->page(1, 2, 0, 10);

        self::assertSame(['10-0', '20-3', '20-13'], $this->offerIds($products));
        self::assertSame([[10, 0], [20, 3], [20, 13]], $provider->hydrations);
    }

    public function testPaginatesTheFlattenedOfferStreamAcrossParentBoundariesWithoutGaps(): void
    {
        $enumerator = new RecordingProductEnumerator([10, 20, 30]);
        $provider = new RecordingCatalogProvider([
            10 => ['all' => [], 'active' => []],
            20 => ['all' => [4, 7, 9], 'active' => [4, 7, 9]],
            30 => ['all' => [], 'active' => []],
        ]);
        $source = $this->source($enumerator, $provider);

        self::assertSame(['10-0', '20-4'], $this->offerIds($source->page(1, 2, 0, 2)));
        self::assertSame(['20-7', '20-9'], $this->offerIds($source->page(1, 2, 2, 2)));
        self::assertSame(['30-0'], $this->offerIds($source->page(1, 2, 4, 2)));
    }

    public function testSlicesAProductWithMoreCombinationsThanTheLimitWithoutMaterializingThemAll(): void
    {
        $enumerator = new RecordingProductEnumerator([42]);
        $provider = new RecordingCatalogProvider([
            42 => ['all' => range(1, 100), 'active' => range(1, 100)],
        ]);
        $source = $this->source($enumerator, $provider);

        self::assertSame(['42-41', '42-42', '42-43'], $this->offerIds($source->page(1, 2, 40, 3)));
        self::assertSame([[42, 1, 2, 40, 3]], $provider->combinationPageCalls);
        self::assertLessThanOrEqual(3, count($provider->hydrations));
        foreach ($enumerator->calls as $call) {
            self::assertSame(1, $call['pagination']['limit']);
            self::assertSame('id_product', $call['pagination']['orderBy']);
            self::assertSame('ASC', $call['pagination']['orderWay']);
        }
    }

    public function testPassesExistingFiltersToEveryBoundedParentEnumeration(): void
    {
        $filters = [[
            'attribute' => 'product_id',
            'condition' => 'is',
            'value' => [['id' => 42, 'value' => '42']],
        ]];
        $enumerator = new RecordingProductEnumerator([42]);
        $provider = new RecordingCatalogProvider([42 => ['all' => [], 'active' => []]]);
        $source = new CatalogProductSource(
            $enumerator,
            $provider,
            new MerchantProductMapper(),
            $filters
        );

        self::assertSame(['42-0'], $this->offerIds($source->page(1, 2, 0, 1)));
        self::assertSame($filters, $enumerator->calls[0]['filters']);
    }

    public function testAssertsTrustedContextBeforeReadingAnyCatalogData(): void
    {
        $enumerator = new RecordingProductEnumerator([42]);
        $provider = new RecordingCatalogProvider([42 => ['all' => [], 'active' => []]], 1, 2);
        $source = $this->source($enumerator, $provider);

        try {
            $source->page(9, 2, 0, 1);
            self::fail('Mismatched shop context must be rejected.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame([], $enumerator->calls);
            self::assertSame([], $provider->countCalls);
            self::assertSame([], $provider->hydrations);
        }
    }

    public function testRejectsRelativeOrMissingCanonicalUrlsReturnedByTheProvider(): void
    {
        $enumerator = new RecordingProductEnumerator([42]);
        $provider = new RecordingCatalogProvider(
            [42 => ['all' => [], 'active' => []]],
            1,
            2,
            static function (int $productId, int $attributeId): CatalogProduct {
                return RecordingCatalogProvider::catalogProduct($productId, $attributeId, '/relative-link', '');
            }
        );
        $source = $this->source($enumerator, $provider);

        try {
            $source->page(1, 2, 0, 1);
            self::fail('A source must not emit products with untrusted URLs.');
        } catch (ProductValidationException $exception) {
            self::assertContains(['field' => 'link', 'code' => 'invalid_url'], $exception->errors());
            self::assertContains(['field' => 'imageLink', 'code' => 'required'], $exception->errors());
        }
    }

    public function testRejectsDuplicateOrNonAdvancingParentIdsInsteadOfLooping(): void
    {
        $enumerator = new RepeatingProductEnumerator(42);
        $provider = new RecordingCatalogProvider([42 => ['all' => [], 'active' => []]]);
        $source = $this->source($enumerator, $provider);

        $this->expectException(LogicException::class);
        $this->expectExceptionMessage('Product enumeration did not advance.');

        $source->page(1, 2, 1, 1);
    }

    public function testStopsAtTheConfiguredParentScanBoundWhenNoOffersCanAdvanceThePage(): void
    {
        $enumerator = new EndlessProductEnumerator();
        $provider = new EmptyCombinationCatalogProvider();
        $source = new CatalogProductSource(
            $enumerator,
            $provider,
            new MerchantProductMapper(),
            [],
            3
        );

        $this->expectException(LogicException::class);
        $this->expectExceptionMessage('Product enumeration exceeded its scan bound.');

        $source->page(1, 2, 0, 1);
    }

    /**
     * @dataProvider invalidPageProvider
     */
    public function testValidatesPageArguments(int $shopId, int $languageId, int $offset, int $limit): void
    {
        $source = $this->source(
            new RecordingProductEnumerator([]),
            new RecordingCatalogProvider([], 1, 2)
        );

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
        CatalogProductProviderInterface $provider
    ): CatalogProductSource {
        return new CatalogProductSource($enumerator, $provider, new MerchantProductMapper());
    }

    /**
     * @param CatalogProduct[] $products
     *
     * @return string[]
     */
    private function offerIds(array $products): array
    {
        return array_map(static function (CatalogProduct $product): string {
            return $product->offerId();
        }, $products);
    }
}

class RecordingProductEnumerator extends ProductEnumerator
{
    /** @var int[] */
    private $productIds;

    /** @var array<int, array{filters: array, pagination: array}> */
    public $calls = [];

    /** @param int[] $productIds */
    public function __construct(array $productIds)
    {
        $this->productIds = $productIds;
    }

    public function listProductsMatchingFilters(array $filters, array $paginationParams): array
    {
        $this->calls[] = ['filters' => $filters, 'pagination' => $paginationParams];
        $rows = array_slice(
            $this->productIds,
            $paginationParams['offset'],
            $paginationParams['limit']
        );

        return array_map(static function (int $productId): array {
            return ['id_product' => $productId];
        }, $rows);
    }

    public function countProductsMatchingFilters(array $filters): int
    {
        unset($filters);

        return count($this->productIds);
    }
}

class RepeatingProductEnumerator extends ProductEnumerator
{
    /** @var int */
    private $productId;

    public function __construct(int $productId)
    {
        $this->productId = $productId;
    }

    public function listProductsMatchingFilters(array $filters, array $paginationParams): array
    {
        unset($filters, $paginationParams);

        return [['id_product' => $this->productId]];
    }

    public function countProductsMatchingFilters(array $filters): int
    {
        unset($filters);

        return 2;
    }
}

class EndlessProductEnumerator extends ProductEnumerator
{
    public function __construct()
    {
    }

    public function listProductsMatchingFilters(array $filters, array $paginationParams): array
    {
        unset($filters);

        return [['id_product' => $paginationParams['offset'] + 1]];
    }

    public function countProductsMatchingFilters(array $filters): int
    {
        unset($filters);

        return 10;
    }
}

class RecordingCatalogProvider implements CatalogProductProviderInterface
{
    /** @var array<int, array{all: int[], active: int[]}> */
    protected $combinations;

    /** @var int */
    private $shopId;

    /** @var int */
    private $languageId;

    /** @var callable|null */
    private $factory;

    /** @var array<int, int> */
    public $countCalls = [];

    /** @var array<int, array{0: int, 1: int, 2: int, 3: int, 4: int}> */
    public $combinationPageCalls = [];

    /** @var array<int, array{0: int, 1: int}> */
    public $hydrations = [];

    /**
     * @param array<int, array{all: int[], active: int[]}> $combinations
     * @param callable|null $factory
     */
    public function __construct(array $combinations, int $shopId = 1, int $languageId = 2, $factory = null)
    {
        $this->combinations = $combinations;
        $this->shopId = $shopId;
        $this->languageId = $languageId;
        $this->factory = $factory;
    }

    public function assertContext(int $shopId, int $languageId): void
    {
        if ($shopId !== $this->shopId || $languageId !== $this->languageId) {
            throw new InvalidArgumentException('Catalog context is not trusted.');
        }
    }

    public function combinationCounts(int $productId, int $shopId): array
    {
        $this->countCalls[] = $productId;
        $combination = $this->combinations[$productId] ?? ['all' => [], 'active' => []];

        return ['total' => count($combination['all']), 'active' => count($combination['active'])];
    }

    public function activeCombinationIds(
        int $productId,
        int $shopId,
        int $languageId,
        int $offset,
        int $limit
    ): array {
        $this->combinationPageCalls[] = [$productId, $shopId, $languageId, $offset, $limit];

        return array_slice($this->combinations[$productId]['active'], $offset, $limit);
    }

    public function product(int $productId, int $attributeId, int $shopId, int $languageId): CatalogProduct
    {
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
        string $imageLink
    ): CatalogProduct {
        return new CatalogProduct(
            $productId . '-' . $attributeId,
            'Silk Lamp',
            'Hand-finished lamp',
            $link,
            $imageLink,
            true,
            '449.99',
            'EUR',
            null,
            null,
            null
        );
    }
}

class EmptyCombinationCatalogProvider extends RecordingCatalogProvider
{
    public function __construct()
    {
        parent::__construct([]);
    }

    public function combinationCounts(int $productId, int $shopId): array
    {
        unset($productId, $shopId);

        return ['total' => 1, 'active' => 0];
    }
}
