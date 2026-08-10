<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use RuntimeException;

final class CronContextSwitcher
{
    /** @var object */
    private $context;

    /** @var callable */
    private $shopResolver;

    /** @var callable */
    private $languageResolver;

    /** @var callable */
    private $shopLanguageIdsResolver;

    /** @var callable */
    private $defaultCurrencyIdResolver;

    /** @var callable */
    private $currencyResolver;

    /** @var callable */
    private $shopActivator;

    /** @param mixed $context */
    public function __construct(
        $context,
        ?callable $shopResolver = null,
        ?callable $languageResolver = null,
        ?callable $shopLanguageIdsResolver = null,
        ?callable $defaultCurrencyIdResolver = null,
        ?callable $currencyResolver = null,
        ?callable $shopActivator = null
    ) {
        if (!is_object($context)) {
            throw new RuntimeException('Cron context is unavailable.');
        }

        $this->context = $context;
        $this->shopResolver = $shopResolver ?? static function (int $shopId): object {
            return new \Shop($shopId);
        };
        $this->languageResolver = $languageResolver ?? static function (int $languageId): object {
            return new \Language($languageId);
        };
        $this->shopLanguageIdsResolver = $shopLanguageIdsResolver ?? static function (int $shopId): array {
            return \Language::getLanguages(true, $shopId, true);
        };
        $this->defaultCurrencyIdResolver = $defaultCurrencyIdResolver ?? static function (int $shopId): int {
            return (int) \Configuration::get('PS_CURRENCY_DEFAULT', null, null, $shopId);
        };
        $this->currencyResolver = $currencyResolver ?? static function (int $currencyId): object {
            return new \Currency($currencyId);
        };
        $this->shopActivator = $shopActivator ?? static function (int $shopId): void {
            \Shop::setContext(\Shop::CONTEXT_SHOP, $shopId);
        };
    }

    public function __invoke(int $shopId, int $languageId): void
    {
        if (0 >= $shopId || 0 >= $languageId) {
            throw new RuntimeException('Cron context is unavailable.');
        }

        $shop = ($this->shopResolver)($shopId);
        $language = ($this->languageResolver)($languageId);
        $languageIds = ($this->shopLanguageIdsResolver)($shopId);
        $currencyId = ($this->defaultCurrencyIdResolver)($shopId);
        $currency = ($this->currencyResolver)($currencyId);

        if (!$this->isActiveObjectForId($shop, $shopId)
            || !$this->isActiveObjectForId($language, $languageId)
            || !$this->containsId($languageIds, $languageId)
            || 0 >= $currencyId
            || !$this->isActiveObjectForId($currency, $currencyId)
        ) {
            throw new RuntimeException('Cron context is unavailable.');
        }

        ($this->shopActivator)($shopId);
        $this->context->shop = $shop;
        $this->context->language = $language;
        $this->context->currency = $currency;
    }

    /** @param mixed $value */
    private function isActiveObjectForId($value, int $expectedId): bool
    {
        return is_object($value)
            && $expectedId === $this->integerId($value->id ?? null)
            && !empty($value->active);
    }

    /** @param mixed $values */
    private function containsId($values, int $expectedId): bool
    {
        if (!is_array($values)) {
            return false;
        }

        foreach ($values as $value) {
            if ($expectedId === $this->integerId($value)) {
                return true;
            }
        }

        return false;
    }

    /** @param mixed $value */
    private function integerId($value): ?int
    {
        if (is_int($value)) {
            return 0 < $value ? $value : null;
        }
        if (!is_string($value) || 1 !== preg_match('/^[1-9][0-9]*$/D', $value)) {
            return null;
        }

        $integer = (int) $value;

        return 0 < $integer && (string) $integer === $value ? $integer : null;
    }
}
