<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;
use JsonException;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\FilterValidator;
use RuntimeException;
use Throwable;

final class ConfigurationCatalogFilterSettings implements CatalogFilterSettingsInterface
{
    private const CONFIGURATION_KEY = 'PSX_MKTG_WITH_GOOGLE_PRODUCT_FILTERS';
    private const MAX_JSON_BYTES = 65536;
    private const MAX_JSON_DEPTH = 16;

    /** @var ConfigurationAdapter */
    private $configuration;

    /** @var FilterValidator */
    private $validator;

    public function __construct(ConfigurationAdapter $configuration, FilterValidator $validator)
    {
        $this->configuration = $configuration;
        $this->validator = $validator;
    }

    public function filtersForShop(int $shopId): array
    {
        $this->assertShopId($shopId);
        $stored = $this->configuration->get(self::CONFIGURATION_KEY, null, null, $shopId, false);
        if (false === $stored || null === $stored) {
            return [];
        }

        if (!is_string($stored) || self::MAX_JSON_BYTES < strlen($stored)) {
            throw new InvalidArgumentException('Stored product filters are invalid.');
        }
        $trimmed = trim($stored);
        if ('' === $trimmed || '[' !== $trimmed[0] || ']' !== substr($trimmed, -1)) {
            throw new InvalidArgumentException('Stored product filters are invalid.');
        }

        try {
            $filters = json_decode($trimmed, true, self::MAX_JSON_DEPTH, JSON_THROW_ON_ERROR);
            if (!is_array($filters)) {
                throw new JsonException('Expected a JSON array.');
            }
            $this->validateCanonicalFilters($filters);
        } catch (Throwable $exception) {
            unset($exception);
            throw new InvalidArgumentException('Stored product filters are invalid.');
        }

        return $filters;
    }

    public function replaceForShop(int $shopId, array $filters): void
    {
        $this->assertShopId($shopId);
        try {
            $this->validateCanonicalFilters($filters);
            $encoded = json_encode($filters, JSON_THROW_ON_ERROR);
            if (!is_string($encoded) || self::MAX_JSON_BYTES < strlen($encoded)) {
                throw new InvalidArgumentException('Encoded filters exceed their size bound.');
            }
        } catch (Throwable $exception) {
            unset($exception);
            throw new InvalidArgumentException('Product filters are invalid.');
        }

        if (true !== $this->configuration->updateValue(
            self::CONFIGURATION_KEY,
            $encoded,
            false,
            null,
            $shopId
        )) {
            throw new RuntimeException('Unable to persist product filters.');
        }
    }

    /** @param array<int, mixed> $filters */
    private function validateCanonicalFilters(array $filters): void
    {
        if (!array_is_list($filters)) {
            throw new InvalidArgumentException('Filters must be a list.');
        }
        foreach ($filters as $filter) {
            if (!is_array($filter)) {
                throw new InvalidArgumentException('Every filter must be an object.');
            }
            $keys = array_keys($filter);
            sort($keys);
            if (['attribute', 'condition', 'value'] !== $keys
                || !is_string($filter['attribute'])
                || !is_string($filter['condition'])
            ) {
                throw new InvalidArgumentException('Every filter must have the canonical shape.');
            }
        }

        $this->validator->validate($filters);
    }

    private function assertShopId(int $shopId): void
    {
        if (0 >= $shopId) {
            throw new InvalidArgumentException('Shop ID must be positive.');
        }
    }
}
