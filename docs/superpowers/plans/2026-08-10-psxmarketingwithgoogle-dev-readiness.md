# Marketing with Google Dev Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build stable `psxmarketingwithgoogle` version `1.75.6` into a reproducible installable ZIP and prove its lifecycle and primary pages on the isolated PrestaShop 9.1.4 development shop.

**Architecture:** Preserve the upstream stable module and add only a deterministic release wrapper plus a package contract. Build PHP and JavaScript dependencies exactly once from their lockfiles, stage only runtime files under one `psxmarketingwithgoogle/` root, then exercise the resulting archive through PrestaShop's real module command and authenticated browser session.

**Tech Stack:** PHP 8.3, Composer 2, Node 22, pnpm 11 with the upstream lockfile, Bash, Python 3 standard-library ZIP support, PrestaShop 9.1.4, Docker Compose, Playwright Chromium.

## Global Constraints

- The source baseline is upstream stable tag `v1.75.6`; current `master` prerelease code is out of scope.
- Preserve upstream runtime behavior and make only narrowly scoped compatibility or packaging changes after a reproduced failure.
- The archive path is `dist/psxmarketingwithgoogle-v1.75.6-ready.zip` and it contains one top-level `psxmarketingwithgoogle/` directory.
- Do not include Git metadata, `_dev`, tests, local caches, build tooling, credentials, `.env` files, or source maps in the archive.
- Do not connect real Google, Merchant Center, Ads, or PrestaShop Accounts credentials.
- Operate only on `/home/ubuntu/projects/psxmarketingwithgoogle` and the isolated `tinylux-prestashop` Docker project; do not reset shared volumes.
- Preserve unrelated Tiny Lux repository changes.

**Design reference:** `docs/superpowers/specs/2026-08-10-psxmarketingwithgoogle-dev-readiness-design.md`

---

## File Structure

- `scripts/build-ready-package.sh`: reproduces the upstream dependency build, stages runtime files, creates the deterministic named ZIP, and emits its SHA-256 digest.
- `tests/package-ready-contract.sh`: executes the real archive boundary and rejects missing runtime files, wrong versions, multiple roots, credentials, and development-only content.
- `dist/psxmarketingwithgoogle-v1.75.6-ready.zip`: ignored build output delivered to the user.
- `dist/psxmarketingwithgoogle-v1.75.6-ready.zip.sha256`: ignored checksum output delivered with the ZIP.

### Task 1: Establish a passing upstream source baseline

**Files:**

- Verify: `composer.lock`
- Verify: `_dev/pnpm-lock.yaml`
- Verify: `tests/unit/phpunit.xml`
- Verify: `.php-cs-fixer.dist.php`

**Interfaces:**

- Consumes: upstream tag `v1.75.6`, Composer lockfile, pnpm lockfile.
- Produces: installed development dependencies, compiled local assets, and fresh test evidence before packaging changes.

- [ ] **Step 1: Verify the branch is based on the selected stable tag and only design documentation differs**

Run:

```bash
git merge-base --is-ancestor v1.75.6 HEAD
git diff --name-only v1.75.6...HEAD
git status --short
```

Expected: the ancestry command exits 0; committed differences contain only `docs/superpowers/`; the working tree contains no unexpected source edits.

- [ ] **Step 2: Install exact PHP development dependencies**

Run:

```bash
composer install --no-interaction --prefer-dist --optimize-autoloader
```

Expected: exit 0 and `vendor/bin/phpunit`, `vendor/bin/php-cs-fixer`, `vendor/bin/autoindex`, and `vendor/autoload.php` exist.

- [ ] **Step 3: Run PHP unit, syntax, and coding-standard gates**

Run:

```bash
vendor/bin/phpunit --configuration tests/unit/phpunit.xml tests/unit
git ls-files '*.php' -z | xargs -0 -n1 php -l
PHP_CS_FIXER_IGNORE_ENV=1 vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no
```

Expected: PHPUnit reports zero failures/errors; every tracked PHP file reports no syntax errors; PHP CS Fixer exits 0.

- [ ] **Step 4: Install exact JavaScript dependencies**

Run:

```bash
pnpm --dir _dev install --frozen-lockfile
```

Expected: exit 0 without modifying `_dev/pnpm-lock.yaml`.

- [ ] **Step 5: Run JavaScript lint and unit tests through each real workspace package**

Run:

```bash
pnpm --dir _dev --filter marketing-with-google-ui lint
pnpm --dir _dev --filter marketing-with-google-verification-tag lint
pnpm --dir _dev --filter marketing-with-google-warning-messages lint
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run
pnpm --dir _dev --filter marketing-with-google-verification-tag test:unit -- --runInBand
pnpm --dir _dev --filter marketing-with-google-warning-messages test:unit -- --runInBand
```

Expected: all linters and test runners exit 0 with zero failed tests.

- [ ] **Step 6: Build every production JavaScript workspace**

Run:

```bash
VUE_APP_BUILD_VERSION=v1.75.6 pnpm --dir _dev -r build
```

Expected: exit 0 and these runtime assets exist: `views/js/app.js`, `views/js/psxmarketingwithgoogle-ui.js`, `views/js/fetchVerificationTag.js`, and `views/js/fetchWarningMessage.js`.

### Task 2: Add a release-package contract and deterministic builder

**Files:**

- Create: `tests/package-ready-contract.sh`
- Create: `scripts/build-ready-package.sh`

**Interfaces:**

- Consumes: a built stable checkout containing `vendor/autoload.php` and compiled `views/js` assets.
- Produces: `scripts/build-ready-package.sh [output.zip]` and `tests/package-ready-contract.sh <archive.zip>`.

- [ ] **Step 1: Write the failing real-archive contract**

Create `tests/package-ready-contract.sh` with this behavior:

```bash
#!/usr/bin/env bash
set -euo pipefail

archive=${1:?usage: tests/package-ready-contract.sh path/to/archive.zip}
module=psxmarketingwithgoogle
expected_version=1.75.6

fail() {
  printf 'package contract failed: %s\n' "$1" >&2
  exit 1
}

[[ -f "$archive" ]] || fail "archive is missing: $archive"

entries=$(unzip -Z1 "$archive")
[[ -n "$entries" ]] || fail 'archive is empty'
if printf '%s\n' "$entries" | grep -Ev "^${module}/"; then
  fail "every entry must be below ${module}/"
fi

for required in \
  "$module/psxmarketingwithgoogle.php" \
  "$module/config.xml" \
  "$module/vendor/autoload.php" \
  "$module/views/js/app.js" \
  "$module/views/js/psxmarketingwithgoogle-ui.js" \
  "$module/views/js/fetchVerificationTag.js" \
  "$module/views/js/fetchWarningMessage.js"
do
  printf '%s\n' "$entries" | grep -Fxq "$required" || fail "missing runtime file: $required"
done

if printf '%s\n' "$entries" | grep -E \
  "(^|/)(\.git|\.env($|\.)|_dev|tests|node_modules|docs/superpowers|Makefile|composer\.(json|lock|phar)|.*\.map$)(/|$)";
then
  fail 'archive contains development-only or sensitive content'
fi

config_version=$(unzip -p "$archive" "$module/config.xml" \
  | sed -n 's:.*<version><!\[CDATA\[\([^]]*\)\]\]></version>.*:\1:p')
[[ "$config_version" == "$expected_version" ]] \
  || fail "config.xml version is $config_version, expected $expected_version"

main_version=$(unzip -p "$archive" "$module/psxmarketingwithgoogle.php" \
  | sed -n "s/.*\\\$this->version = '\([^']*\)';.*/\1/p" \
  | head -n1)
[[ "$main_version" == "$expected_version" ]] \
  || fail "module class version is $main_version, expected $expected_version"

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
unzip -q "$archive" -d "$tmpdir"
php -r "require '$tmpdir/$module/vendor/autoload.php';" \
  || fail 'Composer production autoloader cannot be loaded'

printf 'package contract passed: %s (%s)\n' "$archive" "$expected_version"
```

Production change that this test catches: the builder emits a malformed, incomplete, wrong-version, secret-bearing, or non-loadable PrestaShop archive.

- [ ] **Step 2: Run the contract before a builder exists and verify RED**

Run:

```bash
chmod +x tests/package-ready-contract.sh
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v1.75.6-ready.zip
```

Expected: FAIL with `archive is missing` because no ready archive has been built.

- [ ] **Step 3: Implement the minimal deterministic builder**

Create `scripts/build-ready-package.sh` with this behavior:

```bash
#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
module=psxmarketingwithgoogle
version=1.75.6
output=${1:-"$root/dist/$module-v$version-ready.zip"}
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

cd "$root"
git merge-base --is-ancestor v1.75.6 HEAD

pnpm --dir _dev install --frozen-lockfile
VUE_APP_BUILD_VERSION=v1.75.6 pnpm --dir _dev -r build
composer install --no-interaction --prefer-dist --optimize-autoloader
vendor/bin/autoindex
composer install --no-dev --no-interaction --prefer-dist \
  --optimize-autoloader --classmap-authoritative

test -f vendor/autoload.php
test -f views/js/app.js
test -f views/js/psxmarketingwithgoogle-ui.js
test -f views/js/fetchVerificationTag.js
test -f views/js/fetchWarningMessage.js

mkdir -p "$stage/$module" "$(dirname "$output")"
rsync -a ./ "$stage/$module/" \
  --exclude '/.git/' \
  --exclude '/.env' \
  --exclude '/.env.*' \
  --exclude '/_dev/' \
  --exclude '/tests/' \
  --exclude '/docs/superpowers/' \
  --exclude '/scripts/' \
  --exclude '/dist/' \
  --exclude '/node_modules/' \
  --exclude '/composer.json' \
  --exclude '/composer.lock' \
  --exclude '/composer.phar' \
  --exclude '/Makefile' \
  --exclude '*.map' \
  --exclude '/.php-cs-fixer.dist.php' \
  --exclude '/.editorconfig' \
  --exclude '/.github/' \
  --exclude '/.gitignore' \
  --exclude '/crowdin.yml' \
  --exclude '/e2e-env/'

rm -f "$output" "$output.sha256"
(
  cd "$stage"
  python3 -m zipfile -c "$output" "$module"
)
sha256sum "$output" > "$output.sha256"
"$root/tests/package-ready-contract.sh" "$output"
printf 'ready package: %s\n' "$output"
cat "$output.sha256"
```

- [ ] **Step 4: Build and verify GREEN**

Run:

```bash
chmod +x scripts/build-ready-package.sh
scripts/build-ready-package.sh
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v1.75.6-ready.zip
sha256sum --check dist/psxmarketingwithgoogle-v1.75.6-ready.zip.sha256
```

Expected: the builder exits 0, the package contract reports version `1.75.6`, and the checksum reports `OK`.

- [ ] **Step 5: Rerun the contract against a deliberate forbidden-file mutation**

Run from the repository root:

```bash
mutation_dir=$(mktemp -d)
unzip -q dist/psxmarketingwithgoogle-v1.75.6-ready.zip -d "$mutation_dir"
touch "$mutation_dir/psxmarketingwithgoogle/.env"
(cd "$mutation_dir" && python3 -m zipfile -c bad.zip psxmarketingwithgoogle)
if tests/package-ready-contract.sh "$mutation_dir/bad.zip"; then
  exit 1
fi
rm -rf "$mutation_dir"
```

Expected: the contract fails with `development-only or sensitive content`, proving it catches the forbidden-file regression.

- [ ] **Step 6: Commit the reproducible builder and contract**

Run:

```bash
git add scripts/build-ready-package.sh tests/package-ready-contract.sh
git diff --cached --check
git commit -m "build: add reproducible stable module package"
```

Expected: commit succeeds; ignored `vendor/`, `_dev/node_modules/`, generated assets, and `dist/` are not staged.

### Task 3: Install the built archive on PrestaShop 9.1.4

**Files:**

- Consume: `dist/psxmarketingwithgoogle-v1.75.6-ready.zip`
- Preserve in container: `/tmp/psxmarketingwithgoogle-pre-ready`
- Install to container: `/var/www/html/modules/psxmarketingwithgoogle`

**Interfaces:**

- Consumes: the package contract's verified ZIP.
- Produces: an installed and enabled `psxmarketingwithgoogle` version `1.75.6` in the isolated dev shop, plus a recoverable pre-test module-directory backup.

- [ ] **Step 1: Capture shop and current module state without changing it**

Run in `/home/ubuntu/projects/Tiny Lux website/.worktrees/tinylux-homepage-continued/prestashop-local`:

```bash
docker compose ps
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:8080/
docker compose exec -T prestashop php -r '
require "/var/www/html/config/config.inc.php";
$module = Module::getInstanceByName("psxmarketingwithgoogle");
printf("version=%s installed=%d enabled=%d\n", $module->version, (int) Module::isInstalled($module->name), (int) Module::isEnabled($module->name));
'
```

Expected: all three containers are healthy, storefront returns 200, and the existing bundled module reports version `1.75.6`, installed and enabled.

- [ ] **Step 2: Extract the verified artifact into a bounded temporary host directory**

Run:

```bash
install_stage=$(mktemp -d)
unzip -q /home/ubuntu/projects/psxmarketingwithgoogle/dist/psxmarketingwithgoogle-v1.75.6-ready.zip -d "$install_stage"
test -f "$install_stage/psxmarketingwithgoogle/vendor/autoload.php"
```

Expected: the production autoloader exists below the one module root.

- [ ] **Step 3: Uninstall the current dev copy and preserve its directory**

Run:

```bash
docker compose exec -T prestashop php bin/console prestashop:module uninstall psxmarketingwithgoogle --no-interaction
docker compose exec -T prestashop sh -lc 'rm -rf /tmp/psxmarketingwithgoogle-pre-ready && mv /var/www/html/modules/psxmarketingwithgoogle /tmp/psxmarketingwithgoogle-pre-ready'
```

Expected: PrestaShop reports a successful uninstall and the previous module directory is recoverable at the bounded `/tmp/psxmarketingwithgoogle-pre-ready` path.

- [ ] **Step 4: Copy and install the built module through PrestaShop's real lifecycle**

Run:

```bash
docker compose cp "$install_stage/psxmarketingwithgoogle" prestashop:/var/www/html/modules/
docker compose exec -T prestashop chown -R www-data:www-data /var/www/html/modules/psxmarketingwithgoogle
docker compose exec -T prestashop php bin/console prestashop:module install psxmarketingwithgoogle --no-interaction
docker compose exec -T prestashop php bin/console cache:clear --no-warmup
rm -rf "$install_stage"
```

Expected: copy, install, and cache clear all exit 0.

- [ ] **Step 5: Verify enabled state, version, tabs, and hook registrations using PrestaShop runtime objects**

Run:

```bash
docker compose exec -T prestashop php -r '
require "/var/www/html/config/config.inc.php";
$name = "psxmarketingwithgoogle";
$module = Module::getInstanceByName($name);
if (!$module || $module->version !== "1.75.6" || !Module::isInstalled($name) || !Module::isEnabled($name)) {
    throw new RuntimeException("module state verification failed");
}
$requiredHooks = ["actionCartUpdateQuantityBefore", "displayBackOfficeHeader", "displayHeader", "displayOrderConfirmation", "displayTop"];
$registered = array_column(Db::getInstance()->executeS(
    "SELECT h.name FROM " . _DB_PREFIX_ . "hook h JOIN " . _DB_PREFIX_ . "hook_module hm ON hm.id_hook = h.id_hook JOIN " . _DB_PREFIX_ . "module m ON m.id_module = hm.id_module WHERE m.name = \"" . pSQL($name) . "\""
), "name");
foreach ($requiredHooks as $hook) {
    if (!in_array($hook, $registered, true)) throw new RuntimeException("missing hook: " . $hook);
}
foreach (["AdminPsxMktgWithGoogleModule", "AdminAjaxPsxMktgWithGoogle"] as $tab) {
    if (!Tab::getIdFromClassName($tab)) throw new RuntimeException("missing tab: " . $tab);
}
printf("module=%s version=%s hooks=%d tabs=2\n", $name, $module->version, count($requiredHooks));
'
```

Expected: prints `module=psxmarketingwithgoogle version=1.75.6 hooks=5 tabs=2`.

### Task 4: Verify Back Office, storefront, and package handoff

**Files:**

- Create temporarily: `/tmp/psxmarketingwithgoogle-browser-smoke.mjs`
- Consume securely: local `.env` administrator credentials and an in-memory tokenized module URL.
- Verify: `dist/psxmarketingwithgoogle-v1.75.6-ready.zip.sha256`

**Interfaces:**

- Consumes: installed module and local browser runtime from Tiny Lux `browser-qa/node_modules`.
- Produces: authenticated Back Office and storefront smoke evidence without persisting tokens or credentials.

- [ ] **Step 1: Create a temporary Playwright smoke runner**

Create `/tmp/psxmarketingwithgoogle-browser-smoke.mjs` with:

```javascript
import {chromium} from '/home/ubuntu/projects/Tiny Lux website/.worktrees/tinylux-homepage-continued/prestashop-local/browser-qa/node_modules/playwright/index.mjs';

const {ADMIN_MAIL, ADMIN_PASSWD, MODULE_URL} = process.env;
if (!ADMIN_MAIL || !ADMIN_PASSWD || !MODULE_URL) throw new Error('Missing smoke-test environment.');

const browser = await chromium.launch({headless: true});
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

const login = await page.goto('http://localhost:8080/admin-tinylux/', {waitUntil: 'domcontentloaded'});
if (!login?.ok()) throw new Error(`Back Office login returned ${login?.status()}`);
await page.locator('input[name="email"]').fill(ADMIN_MAIL);
await page.locator('input[name="passwd"]').fill(ADMIN_PASSWD);
await Promise.all([
  page.waitForURL((url) => !url.toString().includes('AdminLogin')),
  page.getByRole('button', {name: 'Log in', exact: true}).click(),
]);

const moduleResponse = await page.goto(MODULE_URL, {waitUntil: 'domcontentloaded'});
if (!moduleResponse || moduleResponse.status() >= 500) {
  throw new Error(`Module page returned ${moduleResponse?.status()}`);
}
const moduleBody = await page.locator('body').innerText();
if (/Fatal error|Uncaught exception|An exception occurred/i.test(moduleBody)) {
  throw new Error('Module page rendered a PHP failure.');
}
if (!/Marketing with Google/i.test(moduleBody)) {
  throw new Error('Module page did not render its identity.');
}

const storefrontResponse = await page.goto('http://localhost:8080/', {waitUntil: 'domcontentloaded'});
if (!storefrontResponse?.ok()) throw new Error(`Storefront returned ${storefrontResponse?.status()}`);
const storefrontBody = await page.locator('body').innerText();
if (/Fatal error|Uncaught exception|An exception occurred/i.test(storefrontBody)) {
  throw new Error('Storefront rendered a PHP failure.');
}
if (pageErrors.length) throw new Error(`Browser page errors: ${pageErrors.join(' | ')}`);

console.log(`browser smoke passed: module=${moduleResponse.status()} storefront=${storefrontResponse.status()}`);
await browser.close();
```

- [ ] **Step 2: Generate the authenticated module URL in memory and run the browser smoke**

Run from the `prestashop-local` directory without printing `MODULE_URL`:

```bash
set -a
. ./.env
set +a
MODULE_URL=$(docker compose exec -T --user www-data prestashop php -r '
define("_PS_ADMIN_DIR_", "/var/www/html/admin-tinylux");
define("PS_ADMIN_DIR", _PS_ADMIN_DIR_);
require "/var/www/html/config/config.inc.php";
$email = getenv("ADMIN_MAIL");
$id = (int) Db::getInstance()->getValue("SELECT id_employee FROM " . _DB_PREFIX_ . "employee WHERE email = \"" . pSQL($email) . "\" AND active = 1");
$context = Context::getContext();
$context->employee = new Employee($id);
$context->shop = new Shop((int) Configuration::get("PS_SHOP_DEFAULT"));
$context->language = new Language((int) Configuration::get("PS_LANG_DEFAULT"));
echo $context->link->getAdminLink("AdminPsxMktgWithGoogleModule");
')
export MODULE_URL ADMIN_MAIL ADMIN_PASSWD
node /tmp/psxmarketingwithgoogle-browser-smoke.mjs
unset MODULE_URL ADMIN_MAIL ADMIN_PASSWD
```

Expected: prints `browser smoke passed` with successful local HTTP statuses; the tokenized URL and credentials are not printed or written to the repository.

- [ ] **Step 3: Check service health and recent module-related PHP failures**

Run:

```bash
docker compose ps
curl -fsS -o /dev/null -w 'storefront=%{http_code}\n' http://localhost:8080/
if docker compose logs --since 20m prestashop | grep -Ei 'Fatal error|Uncaught .*psxmarketingwithgoogle|psxmarketingwithgoogle.*exception'; then
  exit 1
fi
```

Expected: containers remain healthy, storefront is 200, and no module-related fatal or uncaught exception is present.

- [ ] **Step 4: Run final fresh package and source verification**

Run in `/home/ubuntu/projects/psxmarketingwithgoogle`:

```bash
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v1.75.6-ready.zip
sha256sum --check dist/psxmarketingwithgoogle-v1.75.6-ready.zip.sha256
git diff --check
git status --short
```

Expected: package contract and checksum pass; no whitespace errors; only ignored generated dependencies/assets/artifacts remain outside committed source.

- [ ] **Step 5: Record the external-account verification boundary**

Report that source tests, packaging, installation, hook/tab registration, authenticated Back Office rendering, and storefront rendering were verified. State explicitly that live PrestaShop Account login, Google OAuth, Merchant Center synchronization, Google Ads campaign actions, and real conversion delivery were not exercised because they require third-party credentials and account state.
