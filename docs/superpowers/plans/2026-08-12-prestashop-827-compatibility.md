# PrestaShop 8.2.7 Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release Tiny Lux Google 2.0.1 as one installable ZIP verified on PrestaShop 8.2.7 and PrestaShop 9.1.4.

**Architecture:** Keep one source tree and one runtime implementation. Lower only the declared PrestaShop floor to 8.2.7, retain the existing version-specific legacy controller/template branches, and add no new platform branch unless an observed 8.2.7 failure proves it necessary. Deliver the change as version 2.0.1 with an idempotent upgrade step and enforce the release identity and compatibility range in automated package contracts.

**Tech Stack:** PHP 8.1+, PrestaShop legacy module APIs, PHPUnit 8.5, Bash/Python release-contract scripts, deterministic Docker-based packaging, Docker, MariaDB, Node.js/Playwright browser smoke tests.

## Global Constraints

- Minimum PrestaShop version: 8.2.7.
- Supported newer platform generation: PrestaShop 9.x, verified on 9.1.4.
- Minimum PHP version: 8.1.
- Technical module name: `psxmarketingwithgoogle`.
- Release version: 2.0.1.
- Release archive: `dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip`.
- Do not reintroduce PrestaShop Account, Billing, Marketplace, Distribution API, CloudSync, EventBus, Segment, or Sentry runtime dependencies.
- Do not modify Google credentials, Merchant Center state, synchronization semantics, or the existing PrestaShop 9 shop before making a recoverable backup.
- Do not place OAuth client JSON, client secrets, tokens, passwords, database dumps, or secret fingerprints in tracked files or the release archive.

---

### Task 1: Lock the release and compatibility contract

**Files:**
- Create: `tests/unit/Compatibility/ModuleCompatibilityContractTest.php`
- Modify: `psxmarketingwithgoogle.php`
- Modify: `config.xml`

**Interfaces:**
- Consumes: the module constructor metadata and `config.xml` release metadata.
- Produces: module version `2.0.1` and `ps_versions_compliancy['min'] === '8.2.7'` for all later build and runtime tasks.

- [ ] **Step 1: Write the failing compatibility test**

Create `tests/unit/Compatibility/ModuleCompatibilityContractTest.php`:

```php
<?php

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Compatibility;

use PHPUnit\Framework\TestCase;

final class ModuleCompatibilityContractTest extends TestCase
{
    public function testReleaseMetadataSupportsPrestaShop827AndUsesVersion201(): void
    {
        $root = dirname(__DIR__, 3);
        $moduleSource = file_get_contents($root . '/psxmarketingwithgoogle.php');
        self::assertIsString($moduleSource);
        self::assertStringContainsString("$" . "this->version = '2.0.1';", $moduleSource);
        self::assertStringContainsString(
            "$" . "this->ps_versions_compliancy = ['min' => '8.2.7', 'max' => _PS_VERSION_];",
            $moduleSource
        );

        $config = simplexml_load_file($root . '/config.xml');
        self::assertNotFalse($config);
        self::assertSame('2.0.1', (string) $config->version);
    }
}
```

- [ ] **Step 2: Run the focused test and observe RED**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Compatibility/ModuleCompatibilityContractTest.php
```

Expected: FAIL because the source and `config.xml` still declare version 2.0.0 and a PrestaShop 9.0.0 minimum.

- [ ] **Step 3: Make the minimum metadata change**

In `psxmarketingwithgoogle.php`, set:

```php
$this->version = '2.0.1';
$this->ps_versions_compliancy = ['min' => '8.2.7', 'max' => _PS_VERSION_];
```

In `config.xml`, set:

```xml
<version><![CDATA[2.0.1]]></version>
```

Do not change the existing `< 9.0.0` menu CSS branch or the `< 9.0.0` Back Office template branch; those are the intended PrestaShop 8 adapters.

- [ ] **Step 4: Run the focused test and observe GREEN**

Run the command from Step 2.

Expected: PASS.

- [ ] **Step 5: Commit the compatibility metadata**

```bash
git add tests/unit/Compatibility/ModuleCompatibilityContractTest.php psxmarketingwithgoogle.php config.xml
git commit -m "feat: support PrestaShop 8.2.7"
```

---

### Task 2: Add an idempotent 2.0.1 upgrade

**Files:**
- Create: `upgrade/upgrade-2.0.1.php`
- Create: `tests/unit/Upgrade/Upgrade201CompatibilityTest.php`

**Interfaces:**
- Consumes: `Config::HOOK_LIST`, `Database\Installer::installTabs()`, and the module methods `isRegisteredInHook(string): bool` and `registerHook(string): bool`.
- Produces: `upgrade_module_2_0_1($module): bool` and `psxmgUpgrade201RegisterHooks($module, array $hooks): bool`.

- [ ] **Step 1: Write the failing upgrade helper tests**

Create `tests/unit/Upgrade/Upgrade201CompatibilityTest.php` with an isolated module double:

```php
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
```

- [ ] **Step 2: Run the focused test and observe RED**

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Upgrade/Upgrade201CompatibilityTest.php
```

Expected: ERROR because `upgrade/upgrade-2.0.1.php` does not exist.

- [ ] **Step 3: Implement the minimal upgrade**

Create `upgrade/upgrade-2.0.1.php`:

```php
<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

function upgrade_module_2_0_1($module)
{
    $installer = new PrestaShop\Module\PsxMarketingWithGoogle\Database\Installer(
        $module,
        $module->getService(PrestaShop\Module\PsxMarketingWithGoogle\Handler\ErrorHandler::class)
    );
    if (!$installer->installTabs()) {
        return false;
    }

    return psxmgUpgrade201RegisterHooks(
        $module,
        PrestaShop\Module\PsxMarketingWithGoogle\Config\Config::HOOK_LIST
    );
}

function psxmgUpgrade201RegisterHooks($module, array $hooks)
{
    foreach ($hooks as $hook) {
        if ($module->isRegisteredInHook($hook)) {
            continue;
        }
        if (!$module->registerHook($hook)) {
            return false;
        }
    }

    return true;
}
```

This upgrade deliberately does not modify tables or configuration because 2.0.1 changes only platform compatibility and release metadata.

- [ ] **Step 4: Run focused and related upgrade tests**

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Upgrade
```

Expected: PASS for both 2.0.0 and 2.0.1 upgrade helpers.

- [ ] **Step 5: Commit the upgrade path**

```bash
git add upgrade/upgrade-2.0.1.php tests/unit/Upgrade/Upgrade201CompatibilityTest.php
git commit -m "feat: add Tiny Lux Google 2.0.1 upgrade"
```

---

### Task 3: Enforce 2.0.1 and PrestaShop 8.2.7 in the release package

**Files:**
- Modify: `scripts/build-ready-package.sh`
- Modify: `tests/package-ready-contract.sh`
- Modify: `tests/package-ready-contract-self-test.sh`

**Interfaces:**
- Consumes: source metadata from Tasks 1 and 2.
- Produces: deterministic `dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip` plus `.sha256`; rejects archives whose module version or minimum PrestaShop version differs from the release contract.

- [ ] **Step 1: Tighten the package contract before changing the builder**

In `tests/package-ready-contract.sh`:

```bash
expected_version=2.0.1
expected_min_ps_version=8.2.7
```

Pass `expected_min_ps_version` into the embedded Python validator, require
`upgrade/upgrade-2.0.1.php`, and validate the declaration with:

```python
minimum_versions = [match[1] for match in re.findall(
    r"\$this->ps_versions_compliancy\s*=\s*\[\s*['\"]min['\"]\s*=>\s*(['\"])([^'\"]+)\1",
    main_php,
)]
if minimum_versions != [expected_min_ps_version]:
    reject(f"main module minimum PrestaShop version is not {expected_min_ps_version}")

upgrade_201_php = payloads[f"{module}/upgrade/upgrade-2.0.1.php"].decode("utf-8")
if "installTabs()" not in upgrade_201_php or "Config::HOOK_LIST" not in upgrade_201_php:
    reject("2.0.1 upgrade does not restore required tabs and hooks")
```

In `tests/package-ready-contract-self-test.sh`, change the default archive to
2.0.1 and add a mutated fixture that replaces `8.2.7` with `9.0.0`. Assert that
the package contract rejects it as `wrong minimum PrestaShop version`.

- [ ] **Step 2: Run the tightened contract against the previous archive and observe RED**

```bash
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip
```

Expected: FAIL because the previous archive is version 2.0.0, declares PrestaShop 9.0.0+, and lacks the 2.0.1 upgrade.

- [ ] **Step 3: Update the deterministic builder**

In `scripts/build-ready-package.sh`, set:

```bash
release_label=2.0.1-tinylux
```

Set `COMPOSER_ROOT_VERSION=2.0.1`, require both historical
`upgrade/upgrade-2.0.0.php` and current `upgrade/upgrade-2.0.1.php` in the staged
runtime list, and keep the immutable container digests unchanged.

- [ ] **Step 4: Commit the release contract and builder**

```bash
git add scripts/build-ready-package.sh tests/package-ready-contract.sh tests/package-ready-contract-self-test.sh
git commit -m "build: package Tiny Lux Google 2.0.1"
```

The archive is built only after this commit because the builder packages `HEAD` through `git archive`.

---

### Task 4: Update operator documentation and run source-level regression tests

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the 2.0.1 release contract and 8.2.7 minimum.
- Produces: installation, upgrade, verification, and rollback instructions that match the generated artifact.

- [ ] **Step 1: Update release-specific documentation**

Change the title, Google Ads release statement, compatibility requirements,
archive paths, target-version confirmations, verification commands, and rollback
references from 2.0.0 to 2.0.1. Preserve statements specifically describing the
historical 2.0.0 schema migration. State the supported runtime as:

```markdown
- PrestaShop 8.2.7 or PrestaShop 9.x (PHP 8.1 or newer).
```

Document that upgrading from 2.0.0 to 2.0.1 is non-destructive and restores
missing tabs/hooks without changing encrypted Google configuration.

- [ ] **Step 2: Verify documentation and source contracts**

```bash
rg -n "v2\.0\.0-tinylux|confirm that its version is `2\.0\.0`|disable the 2\.0\.0 module" README.md
tests/runtime-network-contract.sh
git diff --check
```

Expected: the `rg` command has no matches; the runtime network contract and diff check pass.

- [ ] **Step 3: Run the complete PHP test harness**

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit
```

Expected: PASS with no failures or errors.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md
git commit -m "docs: document PrestaShop 8.2.7 support"
```

---

### Task 5: Build and validate the 2.0.1 artifact

**Files:**
- Generated, ignored: `dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip`
- Generated, ignored: `dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip.sha256`

**Interfaces:**
- Consumes: committed source from Tasks 1–4 and locally cached digest-pinned build images.
- Produces: the installable 2.0.1 archive used by both runtime shops.

- [ ] **Step 1: Build the committed release**

```bash
scripts/build-ready-package.sh
```

Expected: exit 0 and creation of the 2.0.1 ZIP plus checksum.

- [ ] **Step 2: Run package, adversarial, checksum, and network contracts**

```bash
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip
tests/package-ready-contract-self-test.sh dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip
sha256sum -c dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip.sha256
tests/runtime-network-contract.sh
node tests/browser/tiny-lux-google-smoke.test.mjs
```

Expected: every command passes.

- [ ] **Step 3: Verify archive identity and secret absence**

```bash
unzip -p dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip psxmarketingwithgoogle/config.xml | rg "<version><!\[CDATA\[2\.0\.1\]\]></version>"
unzip -p dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip psxmarketingwithgoogle/psxmarketingwithgoogle.php | rg "'min' => '8\.2\.7'"
git grep -n -i -E 'GOCSPX-|client_secret.+[^*[:space:]]|refresh_token.+[A-Za-z0-9]' -- ':!tests' || true
```

Expected: version and minimum compatibility match; no real credential material is reported.

---

### Task 6: Fresh-install and verify on an isolated PrestaShop 8.2.7 shop

**Files:**
- No tracked files.
- Temporary runtime only: isolated Docker containers, network, and volumes prefixed `psxmg-ps827`.

**Interfaces:**
- Consumes: `dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip`.
- Produces: runtime evidence that fresh install, hooks, tabs, tables, admin UI, JSON API, OAuth alias, cron alias, and browser behavior work on PrestaShop 8.2.7.

- [ ] **Step 1: Start a separate PrestaShop 8.2.7 and MariaDB environment**

Use dedicated names and volumes. The values below are isolated test-only
credentials, not production credentials:

```bash
docker network create psxmg-ps827-net
docker volume create psxmg-ps827-db-data
docker volume create psxmg-ps827-shop-data
docker run -d --name psxmg-ps827-db \
  --network psxmg-ps827-net \
  -e MARIADB_ROOT_PASSWORD='psxmg-827-root-only' \
  -e MARIADB_DATABASE='prestashop' \
  -e MARIADB_USER='prestashop' \
  -e MARIADB_PASSWORD='psxmg-827-db-only' \
  -v psxmg-ps827-db-data:/var/lib/mysql \
  mariadb:10.11
docker run -d --name psxmg-ps827-shop \
  --network psxmg-ps827-net \
  -p 127.0.0.1:8082:80 \
  -e DB_SERVER='psxmg-ps827-db' \
  -e DB_NAME='prestashop' \
  -e DB_USER='prestashop' \
  -e DB_PASSWD='psxmg-827-db-only' \
  -e PS_INSTALL_AUTO=1 \
  -e PS_DOMAIN='127.0.0.1:8082' \
  -e PS_FOLDER_ADMIN='admin-tinylux-827' \
  -e ADMIN_MAIL='dev-admin-827@example.test' \
  -e ADMIN_PASSWD='TinyLux-827-Verification-Only!' \
  -v psxmg-ps827-shop-data:/var/www/html \
  prestashop/prestashop:8.2.7
```

Poll `http://127.0.0.1:8082/` and the container health/log output until the
automatic installation finishes. Do not stop, rename, recreate, or share
volumes with the existing PrestaShop 9 project.

Verify the platform before module installation:

```bash
docker exec psxmg-ps827-shop php -r 'require "config/config.inc.php"; echo _PS_VERSION_, PHP_EOL;'
```

Expected: `8.2.7`.

- [ ] **Step 2: Copy the exact archive payload and install it**

Extract the ZIP into a temporary host directory and copy only its module root:

```bash
psxmg_827_stage=$(mktemp -d)
unzip -q dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip -d "$psxmg_827_stage"
docker cp "$psxmg_827_stage/psxmarketingwithgoogle" psxmg-ps827-shop:/var/www/html/modules/
docker exec psxmg-ps827-shop chown -R www-data:www-data /var/www/html/modules/psxmarketingwithgoogle
```

Then run:

```bash
docker exec psxmg-ps827-shop php bin/console prestashop:module install psxmarketingwithgoogle --no-interaction
docker exec psxmg-ps827-shop php bin/console cache:clear --no-warmup
```

Expected: installation succeeds without compatibility warnings or PHP/Symfony errors.

- [ ] **Step 3: Verify module state, schema, tabs, and hooks**

Run a read-only PHP probe inside the shop that loads `config/config.inc.php` and
asserts:

```php
$module = Module::getInstanceByName('psxmarketingwithgoogle');
assert('2.0.1' === $module->version);
assert(Module::isEnabled($module->name));
assert(4 === count(Db::getInstance()->executeS("SHOW TABLES LIKE '" . _DB_PREFIX_ . "psxmarketingwithgoogle_%'")));
foreach (['AdminPsxMktgWithGoogleModule', 'AdminAjaxPsxMktgWithGoogle', 'AdminTinyLuxGoogleApi'] as $className) {
    assert(0 < (int) Tab::getIdFromClassName($className));
}
foreach (PrestaShop\Module\PsxMarketingWithGoogle\Config\Config::HOOK_LIST as $hook) {
    assert($module->isRegisteredInHook($hook));
}
```

Expected: the probe exits 0.

- [ ] **Step 4: Verify public route behavior**

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8082/
curl -sS -o /tmp/psxmg-827-cron-response -w '%{http_code}\n' http://127.0.0.1:8082/module/tlgoogleshopping/cron
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8082/module/tlgoogleshopping/oauth
```

Expected: storefront 200; cron 403 with generic JSON; OAuth returns a controlled redirect/error and never a 500.

- [ ] **Step 5: Run the browser smoke against PrestaShop 8.2.7**

Set the isolated shop's admin URL and its test-only credentials, then run:

```bash
TINY_LUX_ADMIN_URL='http://127.0.0.1:8082/admin-tinylux-827/?controller=AdminPsxMktgWithGoogleModule' \
TINY_LUX_STOREFRONT_URL='http://127.0.0.1:8082/' \
TINY_LUX_ADMIN_EMAIL='dev-admin-827@example.test' \
TINY_LUX_ADMIN_PASSWORD='TinyLux-827-Verification-Only!' \
TINY_LUX_PLAYWRIGHT_ROOT="$TINY_LUX_PLAYWRIGHT_ROOT" \
node tests/browser/tiny-lux-google-smoke.mjs
```

Expected: the Back Office app reaches its stable loaded state, no Tiny Lux request returns 5xx, and the storefront opens.

- [ ] **Step 6: Check logs for module-level failures**

```bash
docker logs --since 30m psxmg-ps827-shop 2>&1 | rg -i 'Fatal error|Uncaught .*psxmarketingwithgoogle|psxmarketingwithgoogle.*exception'
```

Expected: no matches. If a real PrestaShop 8.2.7 lifecycle failure appears, invoke `superpowers:systematic-debugging`, reproduce it with a focused failing test, make the smallest version-adaptive fix, rerun Tasks 4–6, and commit that fix independently.

---

### Task 7: Upgrade and regression-test the existing PrestaShop 9.1.4 shop

**Files:**
- No tracked files unless a failing regression requires a test-first compatibility fix.
- Recoverable runtime backup outside the module directory.

**Interfaces:**
- Consumes: the exact archive already verified on PrestaShop 8.2.7.
- Produces: proof that the same 2.0.1 archive upgrades the existing 2.0.0 installation without losing Tiny Lux Google state.

- [ ] **Step 1: Capture a recoverable PrestaShop 9 baseline**

Before copying files, record the active module version, enabled status, four table
counts, controller tab IDs, required hook registrations, and encrypted connection
row counts. Copy the current module directory to a timestamped backup location
outside `/var/www/html/modules/psxmarketingwithgoogle`. Export only the four
module tables to a protected temporary backup; do not display credential values.

Use:

```bash
docker exec tinylux-prestashop-prestashop-1 php -r '
require "config/config.inc.php";
$module = Module::getInstanceByName("psxmarketingwithgoogle");
printf("version=%s enabled=%d\n", $module->version, Module::isEnabled($module->name));
printf("tables=%d\n", count(Db::getInstance()->executeS("SHOW TABLES LIKE \"" . _DB_PREFIX_ . "psxmarketingwithgoogle_%\"")));
printf("connections=%d\n", (int) Db::getInstance()->getValue("SELECT COUNT(*) FROM `" . _DB_PREFIX_ . "psxmarketingwithgoogle_connection`"));
foreach (["AdminPsxMktgWithGoogleModule", "AdminAjaxPsxMktgWithGoogle", "AdminTinyLuxGoogleApi"] as $className) {
    printf("tab:%s=%d\n", $className, (int) Tab::getIdFromClassName($className));
}
foreach (PrestaShop\Module\PsxMarketingWithGoogle\Config\Config::HOOK_LIST as $hook) {
    printf("hook:%s=%d\n", $hook, $module->isRegisteredInHook($hook));
}'
docker exec tinylux-prestashop-prestashop-1 cp -a \
  /var/www/html/modules/psxmarketingwithgoogle \
  /tmp/psxmarketingwithgoogle-pre-2.0.1
docker exec tinylux-prestashop-database-1 sh -lc \
  'umask 077; mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" \
    ps_psxmarketingwithgoogle_connection ps_psxmarketingwithgoogle_oauth_state \
    ps_psxmarketingwithgoogle_sync_job ps_psxmarketingwithgoogle_sync_item \
    > /tmp/psxmarketingwithgoogle-pre-2.0.1.sql'
```

If the actual table prefix is not `ps_`, resolve `_DB_PREFIX_` with the PHP probe
and substitute that exact prefix in the dump command before running it.

- [ ] **Step 2: Deploy the exact 2.0.1 archive and run the upgrade**

Disable the module, replace its directory with the archive's single module root,
restore `www-data:www-data` ownership, then run:

```bash
psxmg_91_stage=$(mktemp -d)
unzip -q dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip -d "$psxmg_91_stage"
docker exec tinylux-prestashop-prestashop-1 php bin/console prestashop:module disable psxmarketingwithgoogle --no-interaction
docker exec tinylux-prestashop-prestashop-1 sh -lc \
  'find /var/www/html/modules/psxmarketingwithgoogle -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +'
docker cp "$psxmg_91_stage/psxmarketingwithgoogle/." \
  tinylux-prestashop-prestashop-1:/var/www/html/modules/psxmarketingwithgoogle/
docker exec tinylux-prestashop-prestashop-1 chown -R \
  www-data:www-data /var/www/html/modules/psxmarketingwithgoogle
docker exec tinylux-prestashop-prestashop-1 php bin/console prestashop:module upgrade psxmarketingwithgoogle --no-interaction
docker exec tinylux-prestashop-prestashop-1 php bin/console prestashop:module enable psxmarketingwithgoogle --no-interaction
docker exec tinylux-prestashop-prestashop-1 php bin/console cache:clear --no-warmup
```

Expected: upgrade and enable succeed.

- [ ] **Step 3: Compare the post-upgrade state to the baseline**

Assert module version 2.0.1, enabled status, all four tables, all controller tabs,
all required hooks, unchanged encrypted connection row count, unchanged selected
Merchant account/data source state, and no plaintext credential file.

- [ ] **Step 4: Verify PrestaShop 9 routes and browser behavior**

Run the public storefront, protected cron alias, OAuth negative-path, authenticated
local API status, and hardened browser smoke checks against the existing public
dev hostname. Expected results match the successful 2.0.0 baseline: storefront
200, cron 403 generic JSON without a valid token, OAuth controlled redirect,
authenticated API 200, and browser smoke PASS.

- [ ] **Step 5: Check application and proxy logs**

Inspect PrestaShop, admin-gate, and tunnel logs from the upgrade timestamp. Expected:
no module-owned 5xx response, PHP fatal, uncaught Tiny Lux exception, or credential
leak.

---

### Task 8: Final reproducibility and release handoff

**Files:**
- Generated, ignored: the final 2.0.1 ZIP and checksum.
- Modify only if verification found a test-first defect: the corresponding focused source/test files.

**Interfaces:**
- Consumes: the source commit and runtime evidence from both supported shops.
- Produces: final reproducible artifact, checksum, clean source state, and concise handoff evidence.

- [ ] **Step 1: Re-run the complete automated verification**

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit
tests/runtime-network-contract.sh
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip
tests/package-ready-contract-self-test.sh dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip
sha256sum -c dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip.sha256
node tests/browser/tiny-lux-google-smoke.test.mjs
git diff --check
git status --short
```

Expected: all checks pass and the tracked worktree is clean.

- [ ] **Step 2: Prove deterministic packaging**

Record the first ZIP SHA-256, rebuild the archive from the same `HEAD`, and compare:

```bash
sha256sum dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip
scripts/build-ready-package.sh
sha256sum -c dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip.sha256
sha256sum dist/psxmarketingwithgoogle-v2.0.1-tinylux.zip
```

Expected: both recorded SHA-256 values are identical.

- [ ] **Step 3: Invoke verification-before-completion and prepare handoff**

Use `superpowers:verification-before-completion` against the fresh outputs. Report:

- the release archive absolute path, size, and SHA-256;
- PHP test totals;
- package/self-test/network/reproducibility results;
- PrestaShop 8.2.7 fresh-install evidence;
- PrestaShop 9.1.4 upgrade/regression evidence; and
- any remaining external Google OAuth consent or Merchant Center action that cannot be safely automated.
