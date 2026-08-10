# Tiny Lux Direct Google Service Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the installed `psxmarketingwithgoogle` module in place into Tiny Lux Google, using direct Google OAuth and Merchant API product synchronization with no runtime PrestaShop-owned account or cloud services.

**Architecture:** Keep the existing PrestaShop module lifecycle, hooks, catalog filters/builders, and useful Vue components. Replace the remote account/onboarding/CloudSync seam with focused PHP services, authenticated local controllers, encrypted shop-scoped persistence, durable synchronization jobs, and direct Google REST calls. Preserve the production OAuth alias `/module/tlgoogleshopping/oauth`; keep Google Ads deterministically disabled until a Developer Token exists.

**Tech Stack:** PrestaShop 9.1.4, PHP 8.1+, MariaDB, PHPUnit 8, Vue 2.7, TypeScript, Vuex, Vitest, pnpm 8, Google OAuth 2.0 web-server flow, Google Merchant API REST v1.

## Global Constraints

- Retain the technical module name `psxmarketingwithgoogle`; release the Tiny Lux fork as version `2.0.0`.
- Support PrestaShop 9.x and PHP `>=8.1`; verify on PrestaShop 9.1.4 with PHP 8.5.0.
- Preserve the existing hooks, catalog filters, product-domain code, carrier fix, and applicable Vue components.
- Remove runtime use of `ps_accounts`, Billing, `ps_eventbus`, CloudSync, PrestaShop-hosted Google APIs/CDNs, Segment, and Sentry.
- Ship all JavaScript, translations, images, and styles locally.
- Keep OAuth Client Secret, refresh token, access token, authorization code, state, and cron token out of Git, ZIP files, browser state, and logs.
- Use the OAuth scope `openid email profile https://www.googleapis.com/auth/content` and request offline access.
- Keep the production callback exactly `https://thetinylux.com/module/tlgoogleshopping/oauth` through a module-route alias.
- Limit the first release to OAuth, Merchant account selection, API data-source management, product synchronization, status, and retries.
- Make no Google Ads API request; render **Developer token required** instead.
- Add each behavior test first, observe the expected failure, implement the minimum code, rerun focused and regression tests, then commit.

## File and responsibility map

- `classes/Security/SecretBox.php`: authenticated encryption and decryption with no logging.
- `classes/OAuth/OAuthStateRepository.php`: create and atomically consume hashed, expiring OAuth state.
- `classes/OAuth/GoogleCredentialRepository.php`: shop-scoped encrypted client/refresh-token persistence.
- `classes/OAuth/GoogleOAuthClient.php`: authorization URL, code exchange, refresh, profile, and revocation.
- `classes/OAuth/GoogleConnectionService.php`: orchestration and browser-safe connection status.
- `classes/Google/GoogleTransportInterface.php`: injectable HTTP boundary.
- `classes/Google/CurlGoogleTransport.php`: production cURL transport.
- `classes/Google/GoogleApiException.php`: sanitized Google failure with retry classification.
- `classes/Merchant/MerchantApiClient.php`: accounts, developer registration, data sources, and products REST calls.
- `classes/Merchant/MerchantAccountService.php`: selected account and data-source orchestration.
- `classes/ProductSync/CatalogProduct.php`: normalized internal product record.
- `classes/ProductSync/CatalogProductSource.php`: paginated PrestaShop products and combinations.
- `classes/ProductSync/MerchantProductMapper.php`: Merchant `ProductInput` payloads and micros conversion.
- `classes/ProductSync/SyncJobRepository.php`: jobs/items/progress persistence.
- `classes/ProductSync/SyncProcessor.php`: bounded, idempotent upload and retry execution.
- `classes/Api/LocalGoogleApi.php`: authenticated local compatibility route dispatcher.
- `controllers/admin/AdminTinyLuxGoogleApiController.php`: Back Office JSON endpoint.
- `controllers/front/oauth.php`: public state-validated OAuth callback.
- `controllers/front/cron.php`: token-protected synchronization runner.
- `sql/install.php`, `sql/uninstall.php`, `upgrade/upgrade-2.0.0.php`: schema lifecycle and in-place upgrade.
- `_dev/packages/mktg-with-google-common/api/onboardingClient.ts`: local controller client without bearer secrets.
- `_dev/apps/ui/src/store/modules/accounts/*`: local Google/Merchant state without PrestaShop Account state.
- `_dev/apps/ui/src/store/modules/product-feed/*`: durable local job status and retry calls.
- `_dev/apps/ui/src/views/onboarding-page.vue`: Tiny Lux onboarding and locked Ads panel.
- `_dev/apps/ui/src/components/settings/google-credentials-form.vue`: secure credential submission/status UI.
- `tests/runtime-network-contract.sh`: forbidden dependency/host scan.
- `tests/package-ready-contract.sh`: Tiny Lux version, local assets, and secret-free archive contract.

---

### Task 1: Establish the Tiny Lux fork boundary and local-only runtime

**Files:**
- Create: `tests/runtime-network-contract.sh`
- Modify: `composer.json`
- Modify: `psxmarketingwithgoogle.php`
- Modify: `classes/config/Config.php`
- Modify: `classes/Database/Installer.php`
- Modify: `classes/Database/Uninstaller.php`
- Modify: `classes/Handler/ErrorHandler.php`
- Delete: `classes/Handler/ModuleFilteredRavenClient.php`
- Delete: `classes/Tracker/Segment.php`
- Delete: `classes/Tracker/TrackerInterface.php`
- Modify: `config/common.yml`
- Modify: `config/admin/services.yml`
- Delete: `config/admin/accounts.yml`
- Delete: `config/admin/billing.yml`
- Delete: `config/common/segment.yml`
- Modify: `controllers/admin/AdminPsxMktgWithGoogleModuleController.php`
- Modify: `_dev/apps/ui/src/main.ts`
- Modify: `_dev/apps/ui/src/router/index.ts`
- Modify: `_dev/apps/ui/src/views/onboarding-page.vue`
- Modify: `_dev/apps/ui/src/shims-tsx.d.ts`
- Modify: `_dev/apps/ui/package.json`
- Modify: `config.xml`

**Interfaces:**
- Consumes: current module lifecycle and locally built `views/js/psxmarketingwithgoogle-ui.js`.
- Produces: module version `2.0.0`, PHP floor `8.1`, locally loaded assets, no telemetry calls, and an enforceable runtime network contract.

- [ ] **Step 1: Write the failing runtime network contract**

Create an executable shell test that scans production source and built assets while excluding `vendor`, `_dev`, `tests`, `docs`, and `dist` where appropriate:

```bash
#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
forbidden='googleshopping-api\.psessentials\.net|api\.cloudsync\.prestashop\.com|assets\.prestashop3\.com|integration-assets\.prestashop3\.com|psxmarketing-cdn|segment\.com|ingest\.sentry\.io|billing-cdc|prestashop-accounts'

if rg -n -i "$forbidden" \
  "$root/classes" "$root/config" "$root/controllers" "$root/psxmarketingwithgoogle.php" \
  "$root/views/js/psxmarketingwithgoogle-ui.js"; then
  printf 'runtime network contract failed\n' >&2
  exit 1
fi
printf 'runtime network contract passed\n'
```

- [ ] **Step 2: Run the contract and observe the correct failure**

Run: `chmod +x tests/runtime-network-contract.sh && tests/runtime-network-contract.sh`

Expected: FAIL listing the current PrestaShop Google API, CDN, Billing, CloudSync, Segment, Sentry, or account references.

- [ ] **Step 3: Remove telemetry/CDN/account bootstrapping and set fork metadata**

Make these concrete changes:

```php
$this->version = '2.0.0';
$this->author = 'Tiny Lux';
$this->displayName = $this->l('Tiny Lux Google');
$this->description = $this->l('Connect Tiny Lux directly to Google Merchant Center and synchronize your catalog.');
$this->ps_versions_compliancy = ['min' => '9.0.0', 'max' => _PS_VERSION_];
```

Remove the upstream Marketplace `$this->module_key` assignment. Set the installed tab name and `config.xml` display name to `Tiny Lux Google`, the author to `Tiny Lux`, and the version to `2.0.0`.

Set Composer `php` and `config.platform.php` to `>=8.1` and `8.1.0`. Remove `segmentio/analytics-php`, `prestashop/prestashop-accounts-installer`, `prestashopcorp/module-lib-billing`, and `sentry/sentry`. Remove their service imports and constructor dependencies. Replace `ErrorHandler` with a local handler that preserves the current throw/status behavior but makes no remote report; delete the Raven and Segment classes. Make the admin controller load `views/js/psxmarketingwithgoogle-ui.js` from `$this->module->getPathUri()` and expose only browser-safe local URLs/status fields.

Replace tracker-dependent installer construction with:

```php
$installer = new Installer($this, $this->getService(ErrorHandler::class));
```

Remove Vue Segment/Sentry initialization and the `@prestashopcorp/billing-cdc` package. Replace `$segment` with a local no-op object during the transition so retained click handlers cannot throw. Remove the Billing route, Billing types/getters, `OnboardingDepsContainer` rendering, and their imports now so this checkpoint builds without the package. Do not yet remove account/product actions; provide empty disconnected state so the module continues to render until the local services arrive. Update the PHP compliance error from 7.2 to 8.1.

- [ ] **Step 4: Build and rerun focused contracts**

Run:

```bash
composer update --with-all-dependencies --no-interaction
pnpm --dir _dev install --frozen-lockfile
pnpm --dir _dev --filter marketing-with-google-ui build
tests/runtime-network-contract.sh
vendor/bin/phpunit --configuration tests/unit/phpunit.xml tests/unit
```

Expected: build and PHP unit tests PASS; runtime contract PASS.

- [ ] **Step 5: Commit the fork boundary**

```bash
git add -A composer.json composer.lock config.xml psxmarketingwithgoogle.php classes/config/Config.php classes/Database classes/Handler classes/Tracker config controllers/admin/AdminPsxMktgWithGoogleModuleController.php _dev/apps/ui tests/runtime-network-contract.sh views/js/psxmarketingwithgoogle-ui.js
git commit -m "refactor: establish Tiny Lux local Google runtime"
```

---

### Task 2: Add shop-scoped schema and authenticated secret storage

**Files:**
- Create: `classes/Security/SecretBox.php`
- Create: `classes/OAuth/GoogleCredentialRepository.php`
- Create: `classes/OAuth/OAuthStateRepository.php`
- Create: `tests/unit/Security/SecretBoxTest.php`
- Create: `tests/unit/OAuth/OAuthStateRepositoryTest.php`
- Create: `tests/unit/OAuth/GoogleCredentialRepositoryTest.php`
- Modify: `sql/install.php`
- Modify: `sql/uninstall.php`
- Create: `upgrade/upgrade-2.0.0.php`
- Create: `config/common/google.yml`
- Modify: `config/common.yml`
- Modify: `classes/config/Config.php`

**Interfaces:**
- Consumes: `_COOKIE_KEY_`, `Db`, and active `id_shop`.
- Produces: `SecretBox::encrypt(string): string`, `SecretBox::decrypt(string): string`, `OAuthStateRepository::issue(int $shopId, int $employeeId, DateTimeImmutable $expiresAt): string`, `OAuthStateRepository::consume(string $rawState, int $shopId): array`, and encrypted shop connection CRUD.

- [ ] **Step 1: Write failing encryption and state tests**

Use literal expected behaviors:

```php
public function testCiphertextRoundTripsAndTamperingFails(): void
{
    $box = new SecretBox(str_repeat('k', 32));
    $ciphertext = $box->encrypt('refresh-token');
    self::assertNotSame('refresh-token', $ciphertext);
    self::assertSame('refresh-token', $box->decrypt($ciphertext));

    $tampered = substr($ciphertext, 0, -2) . 'AA';
    $this->expectException(UnexpectedValueException::class);
    $box->decrypt($tampered);
}
```

```php
public function testStateCanBeConsumedExactlyOnceWithinItsShop(): void
{
    $raw = $this->repository->issue(1, 7, new DateTimeImmutable('+5 minutes'));
    self::assertSame(7, $this->repository->consume($raw, 1)['id_employee']);
    $this->expectException(UnexpectedValueException::class);
    $this->repository->consume($raw, 1);
}
```

- [ ] **Step 2: Run the tests and observe missing-class failures**

Run: `vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Security tests/unit/OAuth`

Expected: FAIL because the new classes do not exist.

- [ ] **Step 3: Implement the four local tables and repositories**

Create these tables with `_DB_PREFIX_`, InnoDB, and `_MYSQL_ENGINE_`:

```sql
psxmarketingwithgoogle_connection(
  id_shop INT UNSIGNED PRIMARY KEY,
  client_id VARCHAR(255) NOT NULL,
  client_secret LONGTEXT NOT NULL,
  refresh_token LONGTEXT NULL,
  google_email VARCHAR(255) NULL,
  merchant_account VARCHAR(64) NULL,
  data_source VARCHAR(128) NULL,
  cron_token LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
)
psxmarketingwithgoogle_oauth_state(
  state_hash CHAR(64) PRIMARY KEY,
  id_shop INT UNSIGNED NOT NULL,
  id_employee INT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  consumed_at DATETIME NULL,
  INDEX(id_shop, expires_at)
)
psxmarketingwithgoogle_sync_job(
  id_job BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_shop INT UNSIGNED NOT NULL,
  status ENUM('pending','running','completed','partial','failed') NOT NULL,
  total INT UNSIGNED NOT NULL DEFAULT 0,
  succeeded INT UNSIGNED NOT NULL DEFAULT 0,
  failed INT UNSIGNED NOT NULL DEFAULT 0,
  skipped INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  started_at DATETIME NULL,
  finished_at DATETIME NULL,
  INDEX(id_shop, status)
)
psxmarketingwithgoogle_sync_item(
  id_item BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_job BIGINT UNSIGNED NOT NULL,
  offer_key VARCHAR(191) NOT NULL,
  status ENUM('pending','running','success','failed','skipped') NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  error_code VARCHAR(64) NULL,
  error_field VARCHAR(191) NULL,
  error_message VARCHAR(500) NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE(id_job, offer_key),
  INDEX(id_job, status)
)
```

`SecretBox` uses `sodium_crypto_secretbox`; derive the production key with `hash('sha256', _COOKIE_KEY_ . '|psxmarketingwithgoogle', true)`. Store `base64_encode($nonce . $ciphertext)`. State storage persists only `hash('sha256', $rawState)` and consumes it with one conditional `UPDATE ... WHERE consumed_at IS NULL AND expires_at >= UTC_TIMESTAMP()`.

- [ ] **Step 4: Run focused and install/uninstall tests**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Security tests/unit/OAuth
php -l sql/install.php
php -l sql/uninstall.php
php -l upgrade/upgrade-2.0.0.php
```

Expected: PASS. In the dev shop, execute install SQL, assert all four tables exist, execute uninstall SQL inside a transaction, and roll the transaction back.

- [ ] **Step 5: Commit secure persistence**

```bash
git add classes/Security classes/OAuth sql upgrade config classes/config/Config.php tests/unit/Security tests/unit/OAuth
git commit -m "feat: add encrypted Google connection persistence"
```

---

### Task 3: Implement direct Google OAuth and the production callback alias

**Files:**
- Create: `classes/Google/GoogleTransportInterface.php`
- Create: `classes/Google/CurlGoogleTransport.php`
- Create: `classes/Google/GoogleApiException.php`
- Create: `classes/OAuth/TokenSet.php`
- Create: `classes/OAuth/GoogleOAuthClient.php`
- Create: `classes/OAuth/GoogleConnectionService.php`
- Create: `controllers/front/oauth.php`
- Create: `tests/unit/OAuth/GoogleOAuthClientTest.php`
- Create: `tests/unit/OAuth/GoogleConnectionServiceTest.php`
- Modify: `psxmarketingwithgoogle.php`
- Modify: `classes/config/Config.php`
- Modify: `config/common/google.yml`

**Interfaces:**
- Consumes: Task 2 repositories and `GoogleTransportInterface::request(string $method, string $url, array $headers, ?string $body): Response`.
- Produces: `GoogleConnectionService::authorizationUrl(int $shopId, int $employeeId, string $redirectUri): string`, `complete(int $shopId, string $state, string $code, string $redirectUri): void`, `accessToken(int $shopId): string`, `status(int $shopId): array`, and `disconnect(int $shopId): void`.

- [ ] **Step 1: Write failing OAuth request-contract tests**

```php
public function testAuthorizationUrlRequestsOfflineMerchantAccess(): void
{
    $url = $this->client->authorizationUrl('client-id', 'https://thetinylux.com/module/tlgoogleshopping/oauth', 'state-value');
    parse_str(parse_url($url, PHP_URL_QUERY), $query);
    self::assertSame('offline', $query['access_type']);
    self::assertSame('consent', $query['prompt']);
    self::assertSame('code', $query['response_type']);
    self::assertSame('state-value', $query['state']);
    self::assertStringContainsString('https://www.googleapis.com/auth/content', $query['scope']);
}
```

Also test that an invalid/reused state prevents token exchange, a successful code exchange encrypts the refresh token, a refresh preserves the old refresh token when Google omits a new one, and status never includes a secret/token field.

- [ ] **Step 2: Run tests and observe missing behavior**

Run: `vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/OAuth/GoogleOAuthClientTest.php tests/unit/OAuth/GoogleConnectionServiceTest.php`

Expected: FAIL because OAuth client/service classes are absent.

- [ ] **Step 3: Implement OAuth endpoints and orchestration**

Use these endpoints:

```php
private const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
private const USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';
private const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';
```

Token exchange sends `client_id`, `client_secret`, `code`, `grant_type=authorization_code`, and the exact `redirect_uri` as form data. Refresh sends `grant_type=refresh_token`. Convert non-2xx responses to sanitized `GoogleApiException` values without retaining response credentials.

Register `moduleRoutes` in `Config::HOOK_LIST` and return this route from `hookModuleRoutes()`:

```php
return [
    'module-tlgoogleshopping-oauth' => [
        'controller' => 'oauth',
        'rule' => 'module/tlgoogleshopping/oauth',
        'keywords' => [],
        'params' => ['fc' => 'module', 'module' => $this->name],
    ],
];
```

The callback accepts either `error=access_denied` or `code` plus `state`; it never accepts a shop ID from the query as authority. Resolve the shop through the consumed state and redirect to a clean Back Office module URL with a non-sensitive result code.

- [ ] **Step 4: Run OAuth, syntax, and route tests**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/OAuth
php -l controllers/front/oauth.php
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit
```

Expected: PASS, including invalid-state and denial cases.

- [ ] **Step 5: Commit OAuth**

```bash
git add classes/Google classes/OAuth controllers/front/oauth.php psxmarketingwithgoogle.php classes/config/Config.php config/common/google.yml tests/unit/OAuth
git commit -m "feat: connect Tiny Lux directly with Google OAuth"
```

---

### Task 4: Add local Back Office API and credential configuration

**Files:**
- Create: `classes/Api/LocalGoogleApi.php`
- Create: `controllers/admin/AdminTinyLuxGoogleApiController.php`
- Create: `tests/unit/Api/LocalGoogleApiTest.php`
- Create: `_dev/apps/ui/src/components/settings/google-credentials-form.vue`
- Create: `_dev/apps/ui/src/components/settings/google-credentials-form.spec.ts`
- Modify: `classes/Database/Installer.php`
- Modify: `classes/config/Config.php`
- Modify: `config/admin/services.yml`
- Modify: `controllers/admin/AdminPsxMktgWithGoogleModuleController.php`
- Modify: `_dev/packages/mktg-with-google-common/api/onboardingClient.ts`
- Modify: `_dev/apps/ui/src/shims-tsx.d.ts`

**Interfaces:**
- Consumes: Task 3 connection service and PrestaShop admin session/token validation.
- Produces: `LocalGoogleApi::dispatch(string $method, string $path, array $body = []): Response`, one admin JSON URL accepting `{method, path, body}`, credential/status routes, and browser-safe `window.tinyLuxGoogleApiUrl`, `window.tinyLuxGoogleOAuthRedirectUri`, `window.tinyLuxGoogleConnection`.

- [ ] **Step 1: Write failing API authorization and credential tests**

```php
public function testCredentialImportRejectsNonWebClient(): void
{
    $response = $this->api->dispatch('POST', 'settings/credentials', [
        'installed' => ['client_id' => 'id', 'client_secret' => 'secret'],
    ]);
    self::assertSame(422, $response->getStatusCode());
    self::assertSame('invalid_web_client', json_decode($response->getBody(), true)['code']);
}
```

```ts
it('submits a web credential without rendering its secret', async () => {
  const credentialFile = new File([
    JSON.stringify({web: {client_id: 'id', client_secret: 'client-secret-value', redirect_uris: ['https://thetinylux.com/module/tlgoogleshopping/oauth']}}),
  ], 'google-oauth.json', {type: 'application/json'});
  const wrapper = mount(GoogleCredentialsForm, {propsData: {connection: {configured: false}}});
  await wrapper.find('input[type=file]').trigger('change', {target: {files: [credentialFile]}});
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(wrapper.text()).not.toContain('client-secret-value');
});
```

- [ ] **Step 2: Run tests and observe the intended failures**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Api/LocalGoogleApiTest.php
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run src/components/settings/google-credentials-form.spec.ts
```

Expected: FAIL because the API and component do not exist.

- [ ] **Step 3: Implement the local API boundary**

Dispatch only an explicit route table:

```php
private const ROUTES = [
    'GET settings/status' => 'settingsStatus',
    'POST settings/credentials' => 'saveCredentials',
    'GET oauth/authorized-url' => 'authorizationUrl',
    'GET oauth' => 'connectionStatus',
    'DELETE oauth' => 'disconnect',
];
```

Reject unknown routes with 404 and invalid JSON with 400. The controller must be an installed hidden admin tab and rely on PrestaShop employee authorization plus the admin token in its generated link.

Change `fetchOnboarding` to POST all logical methods through the local controller:

```ts
const response = await fetch(options.apiUrl, {
  method: 'POST',
  headers: {'Content-Type': 'application/json', Accept: 'application/json'},
  body: JSON.stringify({method, path, body: queryParams?.body || null}),
});
```

Credential import accepts only a `web` JSON object with non-empty `client_id`, `client_secret`, and the production callback in its redirect list. It persists the secret through `GoogleCredentialRepository`; its response is exactly `{configured: true, clientIdSuffix: string, redirectUri: string}` where `redirectUri` is the callback derived for the current public shop host. This allows the same production client to be used on dev after the current public dev callback is added in Google Cloud.

- [ ] **Step 4: Run API/UI tests and build**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Api tests/unit/OAuth
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run src/components/settings/google-credentials-form.spec.ts
pnpm --dir _dev --filter marketing-with-google-ui build
```

Expected: PASS with no secret in snapshots or built JavaScript.

- [ ] **Step 5: Commit local configuration API**

```bash
git add classes/Api controllers/admin/AdminTinyLuxGoogleApiController.php tests/unit/Api classes/Database/Installer.php classes/config/Config.php config/admin/services.yml controllers/admin/AdminPsxMktgWithGoogleModuleController.php _dev views/js/psxmarketingwithgoogle-ui.js
git commit -m "feat: configure Tiny Lux Google locally"
```

---

### Task 5: Implement Merchant accounts and API data sources

**Files:**
- Create: `classes/Merchant/MerchantApiClient.php`
- Create: `classes/Merchant/MerchantAccountService.php`
- Create: `tests/unit/Merchant/MerchantApiClientTest.php`
- Create: `tests/unit/Merchant/MerchantAccountServiceTest.php`
- Modify: `classes/Api/LocalGoogleApi.php`
- Modify: `config/common/google.yml`
- Modify: `_dev/apps/ui/src/store/modules/accounts/actions.ts`
- Modify: `_dev/apps/ui/src/store/modules/accounts/state.ts`
- Modify: `_dev/apps/ui/src/store/modules/accounts/getters.ts`
- Modify: `_dev/apps/ui/src/store/modules/accounts/index.ts`
- Modify: `_dev/apps/ui/src/store/modules/accounts/actions.spec.ts`

**Interfaces:**
- Consumes: `GoogleConnectionService::accessToken(int): string` and `GoogleTransportInterface`.
- Produces: `MerchantApiClient::listAccounts(string): array`, `developerRegistration(string,string): array`, `listDataSources(string,string): array`, `createPrimaryDataSource(string,string,string,string): array`, and `MerchantAccountService::select(int,string): array`.

- [ ] **Step 1: Write failing Merchant normalization tests**

```php
public function testListAccountsNormalizesResourceNamesAndPaginates(): void
{
    $this->transport->queueJson(200, ['accounts' => [['name' => 'accounts/123', 'accountName' => 'Tiny Lux']], 'nextPageToken' => 'next']);
    $this->transport->queueJson(200, ['accounts' => [['name' => 'accounts/456', 'accountName' => 'Outlet']]]);

    self::assertSame([
        ['id' => '123', 'name' => 'Tiny Lux'],
        ['id' => '456', 'name' => 'Outlet'],
    ], $this->client->listAccounts('access-token'));
}
```

Test 401 as reconnect-required, 403 as missing access/registration, 429 and 5xx as retryable, exact OAuth bearer placement, and `PRIMARY`/`API` data-source payloads.

- [ ] **Step 2: Run tests and observe missing-client failures**

Run: `vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Merchant`

Expected: FAIL because Merchant classes are absent.

- [ ] **Step 3: Implement Merchant REST calls and local routes**

Use these REST roots and response normalization:

```php
private const ACCOUNTS_ROOT = 'https://merchantapi.googleapis.com/accounts/v1';
private const DATASOURCES_ROOT = 'https://merchantapi.googleapis.com/datasources/v1';
private const PRODUCTS_ROOT = 'https://merchantapi.googleapis.com/products/v1';
```

Add local routes:

```php
'GET merchant-accounts' => 'merchantAccounts',
'POST merchant-accounts/select' => 'selectMerchantAccount',
'GET merchant-data-sources' => 'dataSources',
'POST merchant-data-sources' => 'createDataSource',
```

`select()` accepts digits only, confirms the ID exists in `listAccounts()`, checks developer registration, then stores the selection. `createPrimaryDataSource()` sends display name `Tiny Lux PrestaShop API`, type `PRIMARY`, and `primaryProductDataSource.channel=ONLINE_PRODUCTS` with the chosen content language/feed label.

Rename Vue state fields from `shopIdPsAccounts` and `tokenPsAccounts` to local connection fields. Remove `contextPsAccounts`, aggregator IDs, account/billing getters, and bearer-token initialization. Keep the existing Google profile and Merchant account card contracts.

- [ ] **Step 4: Run Merchant and account-store regressions**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/Merchant tests/unit/Api
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run src/store/modules/accounts/actions.spec.ts
```

Expected: PASS; no account action calls a PrestaShop domain.

- [ ] **Step 5: Commit Merchant onboarding**

```bash
git add classes/Merchant classes/Api config/common/google.yml tests/unit/Merchant _dev/apps/ui/src/store/modules/accounts
git commit -m "feat: connect Merchant Center directly"
```

---

### Task 6: Build Merchant product payloads from the PrestaShop catalog

**Files:**
- Create: `classes/ProductSync/CatalogProduct.php`
- Create: `classes/ProductSync/CatalogProductSource.php`
- Create: `classes/ProductSync/MerchantProductMapper.php`
- Create: `tests/unit/ProductSync/MerchantProductMapperTest.php`
- Create: `tests/unit/ProductSync/CatalogProductSourceTest.php`
- Create: `config/admin/product_sync.yml`
- Modify: `config/admin/services.yml`

**Interfaces:**
- Consumes: active shop/language/currency, existing `ProductEnumerator`, product/attribute repositories, and PrestaShop link/image utilities.
- Produces: `CatalogProductSource::page(int $shopId, int $languageId, int $offset, int $limit): array<CatalogProduct>` and `MerchantProductMapper::map(CatalogProduct $product, string $contentLanguage, string $feedLabel): array`.

- [ ] **Step 1: Write failing literal payload tests**

```php
public function testMapsRequiredMerchantFieldsAndPriceMicros(): void
{
    $product = new CatalogProduct(
        '42-7', 'Silk Lamp', 'Hand-finished lamp',
        'https://thetinylux.com/lamp', 'https://thetinylux.com/img/lamp.jpg',
        true, '449.99', 'EUR', 'Tiny Lux', '5060123456789', 'TL-LAMP-42'
    );

    self::assertSame([
        'offerId' => '42-7',
        'contentLanguage' => 'en',
        'feedLabel' => 'GB',
        'productAttributes' => [
            'title' => 'Silk Lamp',
            'description' => 'Hand-finished lamp',
            'link' => 'https://thetinylux.com/lamp',
            'imageLink' => 'https://thetinylux.com/img/lamp.jpg',
            'availability' => 'IN_STOCK',
            'condition' => 'NEW',
            'price' => ['amountMicros' => '449990000', 'currencyCode' => 'EUR'],
            'brand' => 'Tiny Lux',
            'gtins' => ['5060123456789'],
            'mpn' => 'TL-LAMP-42',
        ],
    ], $this->mapper->map($product, 'en', 'GB'));
}
```

Also test out-of-stock mapping, HTML stripping, 5,000-character description truncation, missing optional GTIN/MPN/brand, variant offer identity, and rounding `0.01` to `10000` micros.

- [ ] **Step 2: Run mapper/source tests and observe failure**

Run: `vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/ProductSync`

Expected: FAIL because product-sync classes are absent.

- [ ] **Step 3: Implement bounded catalog enumeration and mapping**

`CatalogProductSource` returns active products and each active combination, respects the existing product filters, and never loads more than the requested limit. Derive stable offer IDs as `<id_product>-<id_product_attribute>` with attribute `0` for products without combinations. Generate absolute canonical product and cover-image URLs in the active shop context.

Convert prices without floating-point multiplication:

```php
private function toMicros(string $decimal): string
{
    if (!preg_match('/^(\d+)(?:\.(\d{1,6}))?$/', $decimal, $matches)) {
        throw new InvalidArgumentException('Price must be a positive decimal with at most six fractional digits.');
    }
    $fraction = str_pad($matches[2] ?? '', 6, '0');
    return ltrim($matches[1] . $fraction, '0') ?: '0';
}
```

Validate required title, description, link, image, availability, condition, price, and currency before returning a payload. Return a structured validation failure instead of sending malformed products.

- [ ] **Step 4: Run focused and existing catalog regressions**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/ProductSync tests/unit/ProductFilter tests/unit/Builder/CarrierBuilderTest.php
```

Expected: PASS, including the existing carrier-without-tax regression.

- [ ] **Step 5: Commit product mapping**

```bash
git add classes/ProductSync config/admin/product_sync.yml config/admin/services.yml tests/unit/ProductSync
git commit -m "feat: map PrestaShop products to Merchant API"
```

---

### Task 7: Add durable synchronization jobs, retries, and protected cron

**Files:**
- Create: `classes/ProductSync/SyncJobRepository.php`
- Create: `classes/ProductSync/SyncProcessor.php`
- Create: `controllers/front/cron.php`
- Create: `tests/unit/ProductSync/SyncJobRepositoryTest.php`
- Create: `tests/unit/ProductSync/SyncProcessorTest.php`
- Create: `tests/unit/ProductSync/CronAuthorizationTest.php`
- Modify: `classes/Merchant/MerchantApiClient.php`
- Modify: `classes/Api/LocalGoogleApi.php`
- Modify: `config/admin/product_sync.yml`
- Modify: `psxmarketingwithgoogle.php`

**Interfaces:**
- Consumes: Task 5 selected Merchant/data source, Task 6 catalog source/mapper, OAuth access token, and sync tables.
- Produces: `SyncProcessor::create(int $shopId, bool $full): int`, `runBatch(int $jobId, int $limit = 25): array`, `retryFailed(int $jobId): int`, `status(int $jobId): array`, and cron `?shop=<id_shop>&token=<raw-token>&limit=25`.

- [ ] **Step 1: Write failing job/idempotency/retry tests**

```php
public function testRetryProcessesOnlyFailedItemsAndKeepsSuccesses(): void
{
    $job = $this->processor->create(1, true);
    $this->merchant->failOnce('42-0', new GoogleApiException('quota', 429, true));
    $this->processor->runBatch($job, 25);
    $retry = $this->processor->retryFailed($job);
    $this->processor->runBatch($retry, 25);

    $status = $this->processor->status($retry);
    self::assertSame('completed', $status['status']);
    self::assertSame(2, $status['total']);
    self::assertSame(2, $status['succeeded']);
    self::assertSame(0, $status['failed']);
    self::assertSame(1, $this->merchant->successfulWritesFor('43-0'));
}
```

Test atomic item claiming, no duplicate offer keys, maximum three automatic attempts for retryable failures, no automatic retry for 400 validation errors, sanitized stored errors, stale-running item recovery, and incorrect cron token returning 403.

- [ ] **Step 2: Run tests and observe missing job behavior**

Run: `vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/ProductSync/SyncJobRepositoryTest.php tests/unit/ProductSync/SyncProcessorTest.php tests/unit/ProductSync/CronAuthorizationTest.php`

Expected: FAIL because job/cron classes are absent.

- [ ] **Step 3: Implement batch execution and local routes**

Add product write method:

```php
public function insertProductInput(
    string $accessToken,
    string $accountId,
    string $dataSourceName,
    array $payload
): array;
```

POST to `products/v1/accounts/{accountId}/productInputs:insert` with the data-source resource in the query. `runBatch()` atomically claims up to `limit` pending items, maps each product, sends it, updates the item immediately, then recomputes job totals. Retryable items return to pending while `attempts < 3`; otherwise they become failed.

Add local routes:

```php
'POST sync/jobs' => 'createSyncJob',
'POST sync/jobs/run' => 'runSyncBatch',
'GET sync/jobs/status' => 'syncStatus',
'POST sync/jobs/retry' => 'retrySyncJob',
```

The cron controller uses `hash_equals()` against the decrypted per-shop token, selects the oldest pending/running job, executes at most 25 items, returns counts only, and never returns credentials or raw Google bodies.

- [ ] **Step 4: Run sync regressions**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit/ProductSync tests/unit/Merchant tests/unit/OAuth
php -l controllers/front/cron.php
```

Expected: PASS with deterministic retries and no duplicate successful write.

- [ ] **Step 5: Commit durable sync**

```bash
git add classes/ProductSync classes/Merchant/MerchantApiClient.php classes/Api/LocalGoogleApi.php controllers/front/cron.php config/admin/product_sync.yml psxmarketingwithgoogle.php tests/unit/ProductSync
git commit -m "feat: synchronize Merchant products with durable jobs"
```

---

### Task 8: Switch the retained Vue onboarding and feed screens to local services

**Files:**
- Modify: `_dev/apps/ui/src/main.ts`
- Modify: `_dev/apps/ui/src/router/index.ts`
- Modify: `_dev/apps/ui/src/store/modules/app/state.ts`
- Modify: `_dev/apps/ui/src/store/modules/app/index.ts`
- Modify: `_dev/apps/ui/src/store/modules/app/getters.ts`
- Modify: `_dev/apps/ui/src/store/modules/app/actions.ts`
- Modify: `_dev/apps/ui/src/store/modules/accounts/*`
- Modify: `_dev/apps/ui/src/store/modules/product-feed/actions.ts`
- Modify: `_dev/apps/ui/src/store/modules/product-feed/state.ts`
- Modify: `_dev/apps/ui/src/store/modules/product-feed/getters.ts`
- Modify: `_dev/apps/ui/src/store/modules/product-feed/mutations.ts`
- Modify: `_dev/apps/ui/src/views/onboarding-page.vue`
- Modify: `_dev/apps/ui/src/views/product-feed-page.vue`
- Modify: `_dev/apps/ui/src/components/google-account/google-account-card.vue`
- Modify: `_dev/apps/ui/src/components/merchant-center-account/merchant-center-account-card.vue`
- Modify: `_dev/apps/ui/src/components/onboarding/product-feed-card.vue`
- Create: `_dev/apps/ui/src/components/product-feed/sync-job-status.vue`
- Create: `_dev/apps/ui/src/components/product-feed/sync-job-status.spec.ts`
- Modify: `_dev/packages/mktg-with-google-common/translations/en/ui.json`
- Modify: existing affected Vitest specs

**Interfaces:**
- Consumes: Tasks 4, 5, and 7 local routes.
- Produces: Tiny Lux credentials/connect/account/data-source/sync UI with no account/Billing/CloudSync gates and no remote PrestaShop calls.

- [ ] **Step 1: Write failing onboarding and sync UI tests**

```ts
it('renders direct Tiny Lux onboarding without PrestaShop gates', async () => {
  const wrapper = mount(OnboardingPage, {localVue, store, i18n});
  expect(wrapper.text()).toContain('Tiny Lux Google');
  expect(wrapper.text()).toContain('Sign in with Google');
  expect(wrapper.text()).not.toContain('PrestaShop account');
  expect(wrapper.text()).not.toContain('Billing information');
});
```

```ts
it('renders durable job counts and retries failed products', async () => {
  const wrapper = mount(SyncJobStatus, {propsData: {job: {id: 9, status: 'partial', total: 10, succeeded: 8, failed: 2, skipped: 0}}});
  expect(wrapper.text()).toContain('8 of 10 products synchronized');
  await wrapper.find('[data-test=retry-failed]').trigger('click');
  expect(wrapper.emitted('retry')).toEqual([[9]]);
});
```

- [ ] **Step 2: Run Vitest and observe old-gate failures**

Run:

```bash
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run src/views/onboarding-page.spec.ts src/components/product-feed/sync-job-status.spec.ts
```

Expected: FAIL because old PrestaShop Account/Billing gates render and sync status is absent.

- [ ] **Step 3: Implement Tiny Lux onboarding and local feed status**

Remove `OnboardingDepsContainer`, Billing routes/types/getters, CloudSync consent state, aggregator state, direct CloudSync fetch, Segment events, and remote health checks. Root routing becomes:

```ts
const initialPath: NavigationGuard = async (to, from, next) => {
  await store.dispatch('accounts/WARMUP_STORE');
  next({name: 'configuration'});
};
```

On configuration:

- render credential settings when `configured=false`;
- render Google card when configured;
- enable Merchant selection when Google is connected;
- enable data-source/feed configuration when a Merchant account is selected;
- poll `sync/jobs/status` only while a job is pending/running;
- render sanitized failed items and emit failed-only retry;
- leave existing mapping/filter components intact.

Replace English title/copy with **Tiny Lux Google**, **Connect your Google account**, **Select Merchant Center**, and **Synchronize products**.

- [ ] **Step 4: Run all UI tests, lint, and build**

Run:

```bash
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run
pnpm --dir _dev --filter marketing-with-google-ui lint
pnpm --dir _dev --filter marketing-with-google-ui build
tests/runtime-network-contract.sh
```

Expected: PASS; built UI contains no forbidden PrestaShop service host.

- [ ] **Step 5: Commit the local UI**

```bash
git add _dev views/js/psxmarketingwithgoogle-ui.js tests/runtime-network-contract.sh
git commit -m "feat: run Tiny Lux onboarding and feeds locally"
```

---

### Task 9: Lock Google Ads and remove remaining PrestaShop service packages/assets

**Files:**
- Create: `_dev/apps/ui/src/components/google-ads-account/google-ads-disabled-card.vue`
- Create: `_dev/apps/ui/src/components/google-ads-account/google-ads-disabled-card.spec.ts`
- Modify: `_dev/apps/ui/src/views/onboarding-page.vue`
- Modify: `_dev/apps/ui/src/router/index.ts`
- Modify: `_dev/apps/ui/src/store/index.ts`
- Delete: `_dev/apps/ui/src/views/billing-tab.vue`
- Delete: `_dev/apps/ui/src/components/onboarding/onboarding-deps-container.vue`
- Delete: `_dev/apps/ui/src/lib/billing.ts`
- Remove unused billing/account/telemetry packages from `_dev/apps/ui/package.json`
- Remove PrestaShop-branded module images that are no longer referenced from `views/img/`
- Modify: `tests/runtime-network-contract.sh`

**Interfaces:**
- Consumes: no Ads service.
- Produces: a stable disabled Ads presentation with zero Ads requests and a final full-source forbidden-host/package contract.

- [ ] **Step 1: Write the failing Ads lock test**

```ts
it('explains the missing Developer Token without dispatching Ads actions', async () => {
  const dispatch = vi.fn();
  const wrapper = mount(GoogleAdsDisabledCard, {mocks: {$store: {dispatch}}});
  expect(wrapper.text()).toContain('Developer token required');
  expect(dispatch).not.toHaveBeenCalled();
});
```

Extend the runtime contract to reject imports/package references for `@prestashopcorp/billing-cdc`, `prestashop-accounts`, `ps_eventbus`, `cloudsync`, Segment, and Sentry in source and production assets.

- [ ] **Step 2: Run tests and observe the correct failures**

Run:

```bash
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run src/components/google-ads-account/google-ads-disabled-card.spec.ts
tests/runtime-network-contract.sh
```

Expected: FAIL because the card is absent and old dependencies still exist.

- [ ] **Step 3: Implement deterministic Ads lock and remove dead dependencies**

Replace interactive Google Ads/campaign components in onboarding with `<google-ads-disabled-card />`. Remove campaign and Billing navigation routes from the first-release menu without deleting reusable domain files that are not loaded. Remove all runtime initialization/imports and packages identified by the contract. Rebuild local production assets.

- [ ] **Step 4: Run full source verification**

Run:

```bash
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run
pnpm --dir _dev --filter marketing-with-google-ui lint
pnpm --dir _dev --filter marketing-with-google-ui build
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit
tests/runtime-network-contract.sh
```

Expected: PASS; no Ads action dispatch occurs and no forbidden service reference remains in runtime source or built UI.

- [ ] **Step 5: Commit the clean runtime**

```bash
git add -A _dev views tests/runtime-network-contract.sh
git commit -m "refactor: remove PrestaShop services and lock Ads"
```

---

### Task 10: Package, migrate, install, and verify on PrestaShop 9.1.4

**Files:**
- Modify: `tests/package-ready-contract.sh`
- Modify: `scripts/build-ready-package.sh`
- Create: `tests/browser/tiny-lux-google-smoke.mjs`
- Modify: `README.md`
- Output: `dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip`
- Output: `dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip.sha256`

**Interfaces:**
- Consumes: Tasks 1–9 and the attached OAuth credential at deployment time only.
- Produces: secret-free install archive, in-place dev upgrade, browser/network evidence, rollback backup, and operator setup instructions.

- [ ] **Step 1: Write failing release and browser contracts**

Update package expectations to version `2.0.0` and require local UI, OAuth/cron controllers, schema upgrade, and no credential files. Add archive content scanning:

```bash
if unzip -p "$archive" 'psxmarketingwithgoogle/*' 2>/dev/null \
  | grep -Eai 'client_secret_[0-9]|oauth2\.googleusercontent\.com.*client_secret|googleshopping-api\.psessentials\.net|cloudsync\.prestashop\.com'; then
  fail 'archive contains a credential or forbidden runtime host'
fi
```

The browser smoke must assert inside `#psxMktgWithGoogleApp` using Node's strict assertions:

```js
import assert from 'node:assert/strict';

const moduleText = await page.locator('#psxMktgWithGoogleApp').innerText();
assert.match(moduleText, /Tiny Lux Google/);
assert.match(moduleText, /Sign in with Google/);
assert.match(moduleText, /Developer token required/);
assert.doesNotMatch(moduleText, /PrestaShop account/i);
assert.doesNotMatch(moduleText, /Billing information/i);
```

It must fail on any request hostname matching `prestashop`, `psessentials`, `cloudsync`, `segment`, or `sentry`, while allowing the shop hostname and Google identity/Merchant hosts.

- [ ] **Step 2: Run contracts against the old artifact and observe failure**

Run:

```bash
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v1.75.6-ready.zip
node tests/browser/tiny-lux-google-smoke.mjs
```

Expected: FAIL on version/required files and old onboarding text.

- [ ] **Step 3: Build the Tiny Lux archive and prove it contains no secret**

Update the build script version/output to `2.0.0-tinylux`, build all UI packages, generate production Composer autoloading, exclude `_dev`, tests, docs, `.env*`, attachments, logs, maps, and credential JSON files, then run:

```bash
scripts/build-ready-package.sh dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip
sha256sum -c dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip.sha256
```

Expected: PASS. Compute a SHA-256 fingerprint of the attached Client Secret in memory, then scan tracked files and extracted archive values for that fingerprint/value without printing it; no credential value may appear. The field name `client_secret` is permitted in OAuth implementation code.

- [ ] **Step 4: Back up and upgrade the isolated dev shop**

From `/home/ubuntu/projects/Tiny Lux website/.worktrees/tinylux-homepage-continued/prestashop-local`:

```bash
docker compose exec -T prestashop php bin/console prestashop:module disable psxmarketingwithgoogle --no-interaction
docker compose exec -T prestashop sh -lc 'cp -a /var/www/html/modules/psxmarketingwithgoogle /tmp/psxmarketingwithgoogle-v1.75.6-backup'
docker compose cp /tmp/psxmarketingwithgoogle-v2-stage/psxmarketingwithgoogle prestashop:/var/www/html/modules/
docker compose exec -T prestashop chown -R www-data:www-data /var/www/html/modules/psxmarketingwithgoogle
docker compose exec -T prestashop php bin/console prestashop:module upgrade psxmarketingwithgoogle --no-interaction
docker compose exec -T prestashop php bin/console prestashop:module enable psxmarketingwithgoogle --no-interaction
docker compose exec -T prestashop php bin/console cache:clear --no-warmup
```

Stage the extracted archive at the exact `/tmp/psxmarketingwithgoogle-v2-stage/psxmarketingwithgoogle` path before the copy. Back up the four new tables/config after successful migration.

- [ ] **Step 5: Inject the attached dev credential without packaging it**

Use the authenticated Back Office settings endpoint or a one-time container-local importer reading:

`/home/ubuntu/.codex/attachments/0e2b003b-e513-49c5-86b2-8bf6395cf781/client_secret_940449973019-eikju1qrk1avpdei3nq17h6ssb8nkpg1.apps.googleusercontent.com.json`

The importer output is limited to:

```json
{"configured":true,"redirectUri":"https://thetinylux.com/module/tlgoogleshopping/oauth"}
```

Delete any container-local plaintext copy immediately after successful encrypted persistence. Do not print the JSON file or database ciphertext.

- [ ] **Step 6: Run automated dev-shop verification**

Verify:

```bash
docker compose ps
docker compose exec -T prestashop php -r 'require "config/config.inc.php"; $m=Module::getInstanceByName("psxmarketingwithgoogle"); printf("version=%s active=%d\n", $m->version, Module::isEnabled($m->name));'
node tests/browser/tiny-lux-google-smoke.mjs
```

Expected: shop healthy, module `2.0.0` enabled, Tiny Lux UI present, no PrestaShop account/Billing UI, Ads locked, storefront 200, no PHP/browser fatal errors, and no forbidden outbound host.

- [ ] **Step 7: Complete live Google/Merchant verification**

Add the active public dev callback URI to the Google OAuth client's authorized redirect URIs. In the module:

1. select **Sign in with Google**;
2. complete consent with the Tiny Lux Google account;
3. verify the callback returns to Tiny Lux Google;
4. list accessible Merchant accounts;
5. select the intended Merchant account;
6. verify developer registration;
7. create/reuse `Tiny Lux PrestaShop API` data source;
8. synchronize one controlled product batch;
9. confirm job totals and inspect Merchant Center for the matching offer IDs;
10. retry a controlled validation failure and confirm successful products are not duplicated.

Do not start a full catalog job until the controlled batch is accepted by Merchant API.

- [ ] **Step 8: Run final verification and commit release work**

Run:

```bash
vendor/bin/phpunit -c tests/unit/phpunit.xml tests/unit
pnpm --dir _dev --filter marketing-with-google-ui exec vitest run
pnpm --dir _dev --filter marketing-with-google-ui lint
tests/runtime-network-contract.sh
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip
git status --short
```

Expected: all gates PASS; only intentionally ignored `dist` artifacts remain outside Git.

```bash
git add tests/package-ready-contract.sh scripts/build-ready-package.sh tests/browser/tiny-lux-google-smoke.mjs README.md
git commit -m "build: package Tiny Lux Google 2.0.0"
```

## Rollback checkpoint

If upgrade or browser verification fails, disable the fork, move `/tmp/psxmarketingwithgoogle-v1.75.6-backup` back to `/var/www/html/modules/psxmarketingwithgoogle`, restore the pre-upgrade configuration/table backup, clear cache, and enable the stable module. Do not delete the shared PrestaShop database volume or unrelated shop data.
