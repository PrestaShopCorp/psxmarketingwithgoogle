<?php

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Upgrade;

use PHPUnit\Framework\TestCase;

if (!defined('_PS_VERSION_')) {
    define('_PS_VERSION_', '9.1.4');
}

require_once dirname(__DIR__, 3) . '/upgrade/upgrade-2.0.1.php';

final class Upgrade201CompatibilityTest extends TestCase
{
    public function testRegistersOnlyMissingHooksAndIsIdempotent(): void
    {
        $module = new Upgrade201ModuleDouble(['displayHeader']);

        self::assertTrue(\psxmgUpgrade201RegisterHooks($module, ['displayHeader', 'moduleRoutes']));
        self::assertSame(['moduleRoutes'], $module->registered);
        self::assertTrue(\psxmgUpgrade201RegisterHooks($module, ['displayHeader', 'moduleRoutes']));
        self::assertSame(['moduleRoutes'], $module->registered);
    }

    public function testReturnsFalseWhenARequiredHookCannotBeRegistered(): void
    {
        $module = new Upgrade201ModuleDouble([], ['moduleRoutes']);
        self::assertFalse(\psxmgUpgrade201RegisterHooks($module, ['moduleRoutes']));
    }
}

final class Upgrade201ModuleDouble
{
    private $activeHooks = [];
    private $failingHooks = [];
    public $registered = [];

    public function __construct(array $activeHooks, array $failingHooks = [])
    {
        $this->activeHooks = array_fill_keys($activeHooks, true);
        $this->failingHooks = array_fill_keys($failingHooks, true);
    }

    public function isRegisteredInHook(string $hook): bool
    {
        return isset($this->activeHooks[$hook]);
    }

    public function registerHook(string $hook): bool
    {
        if (isset($this->failingHooks[$hook])) {
            return false;
        }
        $this->registered[] = $hook;
        $this->activeHooks[$hook] = true;

        return true;
    }
}
