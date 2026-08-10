<?php

namespace {
    if (!class_exists('DbQuery')) {
        class DbQuery
        {
            /** @var string[] */
            public $orders = [];

            /** @var array{limit: int, offset: int}|null */
            public $pagination;

            public function from($table, $alias = null)
            {
                unset($table, $alias);

                return $this;
            }

            public function innerJoin($table, $alias = null, $on = null)
            {
                unset($table, $alias, $on);

                return $this;
            }

            public function where($restriction)
            {
                unset($restriction);

                return $this;
            }

            public function select($fields)
            {
                unset($fields);

                return $this;
            }

            public function orderBy($fields)
            {
                $this->orders[] = $fields;

                return $this;
            }

            public function limit($limit, $offset = 0)
            {
                $this->pagination = ['limit' => $limit, 'offset' => $offset];

                return $this;
            }
        }
    }
}

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync {
    use DbQuery;
    use InvalidArgumentException;
    use PHPUnit\Framework\TestCase;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\BrandQueryBuilder;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\CategoryQueryBuilder;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\FeatureQueryBuilder;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\OutOfStockQueryBuilder;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\PriceQueryBuilder;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\AttributeQueryBuilder\ProductIdQueryBuilder;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\FilterValidator;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\QueryBuilder;

    class ProductEnumeratorPaginationTest extends TestCase
    {
        public function testEnumeratorForwardsTheStrictPaginationEnvelopeToTheQueryBuilder(): void
        {
            $pagination = [
                'offset' => 40,
                'limit' => 3,
                'orderBy' => 'id_product',
                'orderWay' => 'ASC',
            ];
            $queryBuilder = new PaginationRecordingQueryBuilder();
            $enumerator = new InMemoryProductEnumerator(new FilterValidator(), $queryBuilder);

            self::assertSame(
                [['id_product' => 42]],
                $enumerator->listProductsMatchingFilters([], $pagination)
            );
            self::assertSame($pagination, $queryBuilder->pagination);
        }

        public function testQueryBuilderCarriesDeterministicOrderAndLimitOffsetIntoSqlQuery(): void
        {
            $query = $this->queryBuilder()->buildQueryToList([], [
                'offset' => 40,
                'limit' => 3,
                'orderBy' => 'id_product',
                'orderWay' => 'ASC',
            ]);

            self::assertSame(['p.id_product ASC'], $query->orders);
            self::assertSame(['limit' => 3, 'offset' => 40], $query->pagination);
        }

        /**
         * @dataProvider invalidPaginationProvider
         *
         * @param array<string, mixed> $pagination
         */
        public function testQueryBuilderRejectsNonAllowlistedOrUnboundedPagination(array $pagination): void
        {
            $this->expectException(InvalidArgumentException::class);

            $this->queryBuilder()->buildQueryToList([], $pagination);
        }

        public function invalidPaginationProvider(): array
        {
            return [
                'negative offset' => [[
                    'offset' => -1, 'limit' => 1, 'orderBy' => 'id_product', 'orderWay' => 'ASC',
                ]],
                'zero limit' => [[
                    'offset' => 0, 'limit' => 0, 'orderBy' => 'id_product', 'orderWay' => 'ASC',
                ]],
                'limit above catalog bound' => [[
                    'offset' => 0, 'limit' => 251, 'orderBy' => 'id_product', 'orderWay' => 'ASC',
                ]],
                'unsafe order field' => [[
                    'offset' => 0, 'limit' => 1, 'orderBy' => 'name', 'orderWay' => 'ASC',
                ]],
                'descending order is not the canonical stream' => [[
                    'offset' => 0, 'limit' => 1, 'orderBy' => 'id_product', 'orderWay' => 'DESC',
                ]],
                'unknown field' => [[
                    'offset' => 0, 'limit' => 1, 'orderBy' => 'id_product', 'orderWay' => 'ASC', 'raw' => 'SQL',
                ]],
                'partial envelope' => [['offset' => 0, 'limit' => 1]],
            ];
        }

        private function queryBuilder(): QueryBuilder
        {
            return new QueryBuilder(
                1,
                $this->createStub(BrandQueryBuilder::class),
                $this->createStub(CategoryQueryBuilder::class),
                $this->createStub(FeatureQueryBuilder::class),
                $this->createStub(OutOfStockQueryBuilder::class),
                $this->createStub(PriceQueryBuilder::class),
                $this->createStub(ProductIdQueryBuilder::class)
            );
        }
    }

    class PaginationRecordingQueryBuilder extends QueryBuilder
    {
        /** @var array<string, mixed>|null */
        public $pagination;

        public function __construct()
        {
        }

        public function buildQueryToList(array $filters, array $paginationParams = []): DbQuery
        {
            unset($filters);
            $this->pagination = $paginationParams;

            return new DbQuery();
        }
    }

    class InMemoryProductEnumerator extends ProductEnumerator
    {
        protected function execute(DbQuery $query): array
        {
            unset($query);

            return [['id_product' => 42]];
        }
    }
}
