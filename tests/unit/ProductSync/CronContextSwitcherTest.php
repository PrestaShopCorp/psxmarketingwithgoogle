<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronContextSwitcher;

class CronContextSwitcherTest extends TestCase
{
    public function testSwitchesToExactActiveShopAssociatedLanguageAndShopDefaultCurrency(): void
    {
        if (!class_exists(CronContextSwitcher::class)) {
            self::fail('CronContextSwitcher is not implemented.');
        }

        $context = (object) [
            'shop' => (object) ['id' => 1],
            'language' => (object) ['id' => 1],
            'currency' => (object) ['id' => 1],
            'cookie' => (object) ['id_lang' => 1, 'id_currency' => 1],
        ];
        $targetShop = (object) ['id' => 7, 'active' => true];
        $targetLanguage = (object) ['id' => 3, 'active' => true];
        $targetCurrency = (object) ['id' => 9, 'active' => true];
        $activations = [];
        $switcher = new CronContextSwitcher(
            $context,
            static function (int $shopId) use ($targetShop): object {
                self::assertSame(7, $shopId);

                return $targetShop;
            },
            static function (int $languageId) use ($targetLanguage): object {
                self::assertSame(3, $languageId);

                return $targetLanguage;
            },
            static function (int $shopId): array {
                self::assertSame(7, $shopId);

                return [2, 3];
            },
            static function (int $shopId): int {
                self::assertSame(7, $shopId);

                return 9;
            },
            static function (int $currencyId) use ($targetCurrency): object {
                self::assertSame(9, $currencyId);

                return $targetCurrency;
            },
            static function (int $shopId) use (&$activations): void {
                $activations[] = $shopId;
            }
        );

        $switcher(7, 3);

        self::assertSame([7], $activations);
        self::assertSame($targetShop, $context->shop);
        self::assertSame($targetLanguage, $context->language);
        self::assertSame($targetCurrency, $context->currency);
        self::assertSame(1, $context->cookie->id_lang);
        self::assertSame(1, $context->cookie->id_currency);
    }

    public function testRejectsLanguageNotAssociatedWithShopBeforeMutatingContext(): void
    {
        if (!class_exists(CronContextSwitcher::class)) {
            self::fail('CronContextSwitcher is not implemented.');
        }

        $originalShop = (object) ['id' => 1];
        $originalLanguage = (object) ['id' => 1];
        $originalCurrency = (object) ['id' => 1];
        $context = (object) [
            'shop' => $originalShop,
            'language' => $originalLanguage,
            'currency' => $originalCurrency,
        ];
        $activated = false;
        $switcher = new CronContextSwitcher(
            $context,
            static function (): object {
                return (object) ['id' => 7, 'active' => true];
            },
            static function (): object {
                return (object) ['id' => 3, 'active' => true];
            },
            static function (): array {
                return [2, 4];
            },
            static function (): int {
                return 9;
            },
            static function (): object {
                return (object) ['id' => 9, 'active' => true];
            },
            static function () use (&$activated): void {
                $activated = true;
            }
        );

        try {
            $switcher(7, 3);
            self::fail('Unassociated language must be rejected.');
        } catch (\RuntimeException $exception) {
            self::assertSame('Cron context is unavailable.', $exception->getMessage());
        }

        self::assertFalse($activated);
        self::assertSame($originalShop, $context->shop);
        self::assertSame($originalLanguage, $context->language);
        self::assertSame($originalCurrency, $context->currency);
    }
}
