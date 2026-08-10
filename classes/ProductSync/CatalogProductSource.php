<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;
use LogicException;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator;

final class CatalogProductSource
{
    private const MAX_PAGE_SIZE = 250;
    private const DEFAULT_MAX_PARENT_SCANS = 1000000;

    /** @var ProductEnumerator */
    private $productEnumerator;

    /** @var CatalogProductProviderInterface */
    private $provider;

    /** @var MerchantProductMapper */
    private $mapper;

    /** @var array<int, array<string, mixed>> */
    private $filters;

    /** @var int */
    private $maxParentScans;

    /**
     * @param array<int, array<string, mixed>> $filters
     */
    public function __construct(
        ProductEnumerator $productEnumerator,
        CatalogProductProviderInterface $provider,
        MerchantProductMapper $mapper,
        array $filters = [],
        int $maxParentScans = self::DEFAULT_MAX_PARENT_SCANS
    ) {
        if (0 >= $maxParentScans) {
            throw new InvalidArgumentException('Parent scan bound must be positive.');
        }
        $this->productEnumerator = $productEnumerator;
        $this->provider = $provider;
        $this->mapper = $mapper;
        $this->filters = $filters;
        $this->maxParentScans = $maxParentScans;
    }

    /** @return CatalogProduct[] */
    public function page(int $shopId, int $languageId, int $offset, int $limit): array
    {
        $this->validatePage($shopId, $languageId, $offset, $limit);
        $this->provider->assertContext($shopId, $languageId);

        $eligibleCount = $this->productEnumerator->countProductsMatchingFilters($this->filters);
        if (0 > $eligibleCount) {
            throw new LogicException('Product enumeration returned an invalid count.');
        }

        $products = [];
        $parentOffset = 0;
        $remainingOffset = $offset;
        $previousProductId = 0;
        while ($parentOffset < $eligibleCount && count($products) < $limit) {
            if ($parentOffset >= $this->maxParentScans) {
                throw new LogicException('Product enumeration exceeded its scan bound.');
            }
            $rows = $this->productEnumerator->listProductsMatchingFilters($this->filters, [
                'offset' => $parentOffset,
                'limit' => 1,
                'orderBy' => 'id_product',
                'orderWay' => 'ASC',
            ]);
            if (1 !== count($rows)) {
                throw new LogicException('Product enumeration returned an incomplete bounded page.');
            }
            ++$parentOffset;

            $productId = $this->productId($rows[0]);
            if ($productId <= $previousProductId) {
                throw new LogicException('Product enumeration did not advance.');
            }
            $previousProductId = $productId;

            $counts = $this->provider->combinationCounts($productId, $shopId);
            $this->validateCombinationCounts($counts);
            $offerCount = 0 === $counts['total'] ? 1 : $counts['active'];
            if (0 === $offerCount) {
                continue;
            }
            if ($remainingOffset >= $offerCount) {
                $remainingOffset -= $offerCount;

                continue;
            }

            $remainingLimit = $limit - count($products);
            if (0 === $counts['total']) {
                $attributeIds = [0];
            } else {
                $requested = min($remainingLimit, $offerCount - $remainingOffset);
                $attributeIds = $this->provider->activeCombinationIds(
                    $productId,
                    $shopId,
                    $languageId,
                    $remainingOffset,
                    $requested
                );
                $this->validateCombinationPage($attributeIds, $requested);
            }
            $remainingOffset = 0;

            foreach ($attributeIds as $attributeId) {
                $product = $this->provider->product($productId, $attributeId, $shopId, $languageId);
                if ($productId . '-' . $attributeId !== $product->offerId()) {
                    throw new LogicException('Catalog provider returned an unstable offer identity.');
                }
                $this->mapper->validate($product);
                $products[] = $product;
            }
        }

        if ($parentOffset >= $this->maxParentScans
            && $parentOffset < $eligibleCount
            && count($products) < $limit
        ) {
            throw new LogicException('Product enumeration exceeded its scan bound.');
        }

        return $products;
    }

    private function validatePage(int $shopId, int $languageId, int $offset, int $limit): void
    {
        if (0 >= $shopId || 0 >= $languageId || 0 > $offset || 0 >= $limit || self::MAX_PAGE_SIZE < $limit) {
            throw new InvalidArgumentException('Catalog page arguments are invalid.');
        }
    }

    /** @param array<string, mixed> $row */
    private function productId(array $row): int
    {
        $raw = $row['id_product'] ?? null;
        if ((!is_int($raw) && (!is_string($raw) || 1 !== preg_match('/^[0-9]+$/D', $raw)))
            || 0 >= (int) $raw
        ) {
            throw new LogicException('Product enumeration returned an invalid product ID.');
        }

        return (int) $raw;
    }

    /** @param array<string, mixed> $counts */
    private function validateCombinationCounts(array $counts): void
    {
        if (!isset($counts['total'], $counts['active'])
            || !is_int($counts['total'])
            || !is_int($counts['active'])
            || 0 > $counts['total']
            || 0 > $counts['active']
            || $counts['active'] > $counts['total']
            || (0 === $counts['total'] && 0 !== $counts['active'])
        ) {
            throw new LogicException('Catalog provider returned invalid combination counts.');
        }
    }

    /** @param mixed[] $attributeIds */
    private function validateCombinationPage(array $attributeIds, int $requested): void
    {
        if ($requested !== count($attributeIds)) {
            throw new LogicException('Catalog provider returned an incomplete combination page.');
        }
        $previous = 0;
        foreach ($attributeIds as $attributeId) {
            if (!is_int($attributeId) || 0 >= $attributeId || $attributeId <= $previous) {
                throw new LogicException('Catalog provider returned invalid combination IDs.');
            }
            $previous = $attributeId;
        }
    }
}
