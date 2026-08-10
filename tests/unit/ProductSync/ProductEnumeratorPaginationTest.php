<?php

namespace {
    if (!class_exists('DbQuery')) {
        class DbQuery
        {
            /** @var string[] */
            private $selects = [];

            /** @var string[] */
            private $from = [];

            /** @var string[] */
            private $joins = [];

            /** @var string[] */
            private $where = [];

            /** @var string[] */
            private $orders = [];

            /** @var array{limit: int, offset: int}|null */
            public $pagination;

            public function from($table, $alias = null)
            {
                $this->from[] = trim($table . ' ' . $alias);

                return $this;
            }

            public function innerJoin($table, $alias = null, $on = null)
            {
                $this->joins[] = 'INNER JOIN ' . trim($table . ' ' . $alias) . ' ON ' . $on;

                return $this;
            }

            public function leftJoin($table, $alias = null, $on = null)
            {
                $this->joins[] = 'LEFT JOIN ' . trim($table . ' ' . $alias) . ' ON ' . $on;

                return $this;
            }

            public function where($restriction)
            {
                $this->where[] = $restriction;

                return $this;
            }

            public function select($fields)
            {
                $this->selects[] = $fields;

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

            public function __toString()
            {
                $sql = 'SELECT ' . implode(', ', $this->selects)
                    . ' FROM ' . implode(', ', $this->from);
                if ([] !== $this->joins) {
                    $sql .= ' ' . implode(' ', $this->joins);
                }
                if ([] !== $this->where) {
                    $sql .= ' WHERE ' . implode(' AND ', $this->where);
                }
                if ([] !== $this->orders) {
                    $sql .= ' ORDER BY ' . implode(', ', $this->orders);
                }
                if (null !== $this->pagination) {
                    $sql .= ' LIMIT ' . $this->pagination['offset'] . ', ' . $this->pagination['limit'];
                }

                return $sql;
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
        public function testEnumeratorExecutesRenderedFlattenedOfferSql(): void
        {
            $pagination = [
                'offset' => 40,
                'limit' => 3,
                'orderBy' => 'id_product',
                'orderWay' => 'ASC',
            ];
            $enumerator = new InMemoryProductEnumerator(new FilterValidator(), $this->queryBuilder());

            self::assertSame(
                [['id_product' => 42, 'id_product_attribute' => 7]],
                $enumerator->listProductOffersMatchingFilters([], $pagination)
            );
            self::assertStringContainsString('LIMIT 40, 3', $enumerator->executedSql);
        }

        public function testQueryBuilderRendersFlattenedOfferJoinDeterministicOrderAndLimitOffset(): void
        {
            $query = $this->queryBuilder()->buildQueryToListOffers([], [
                'offset' => 40,
                'limit' => 3,
                'orderBy' => 'id_product',
                'orderWay' => 'ASC',
            ]);

            $sql = (string) $query;

            self::assertStringContainsString('DISTINCT p.id_product', $sql);
            self::assertStringContainsString(
                'COALESCE(sync_pas.id_product_attribute, 0) AS id_product_attribute',
                $sql
            );
            self::assertRegExp(
                '/LEFT JOIN\s+`?[^`\s]*product_attribute_shop`?\s+`?sync_pas`?\s+ON/i',
                $sql
            );
            self::assertRegExp(
                '/`?sync_pas`?\.`?id_product`?\s*=\s*`?p`?\.`?id_product`?/i',
                $sql
            );
            self::assertRegExp('/`?sync_pas`?\.`?id_shop`?\s*=\s*1/i', $sql);
            self::assertRegExp(
                '/ORDER BY\s+`?p`?\.`?id_product`?\s+ASC,\s*`?id_product_attribute`?\s+ASC/i',
                $sql
            );
            self::assertStringContainsString('LIMIT 40, 3', $sql);
        }

        /**
         * @dataProvider invalidPaginationProvider
         *
         * @param array<string, mixed> $pagination
         */
        public function testQueryBuilderRejectsNonAllowlistedOrUnboundedPagination(array $pagination): void
        {
            $this->expectException(InvalidArgumentException::class);

            $this->queryBuilder()->buildQueryToListOffers([], $pagination);
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

    class InMemoryProductEnumerator extends ProductEnumerator
    {
        /** @var string */
        public $executedSql = '';

        protected function execute(DbQuery $query): array
        {
            $this->executedSql = (string) $query;

            return [['id_product' => 42, 'id_product_attribute' => 7]];
        }
    }
}
