# Tiny Lux Direct Google Service Layer Design

**Date:** 2026-08-10

**Status:** Approved in conversation; awaiting written-spec review

**Implementation base:** `PrestaShopCorp/psxmarketingwithgoogle` stable `v1.75.6`

## Objective

Convert the installed Marketing with Google module into an in-place Tiny Lux fork that connects directly to Google for OAuth, Merchant Center account access, and product synchronization. Preserve the module's mature PrestaShop hooks, catalog-domain code, product builders, database lifecycle, and Vue interface while removing every runtime dependency on PrestaShop-owned account and cloud services.

The first release supports Google authentication, Merchant Center account selection, an API product data source, manual product synchronization, and protected scheduled synchronization. Google Ads remains unavailable until Tiny Lux supplies a Google Ads API Developer Token.

## User-visible outcome

The Back Office navigation and module page use the name **Tiny Lux Google**. The page opens directly to the Google and Merchant Center onboarding flow. It does not display or require a PrestaShop Account, PrestaShop store verification, PrestaShop Billing, or PrestaShop-hosted subscription controls.

The primary flow is:

1. Open Tiny Lux Google.
2. Select **Sign in with Google**.
3. Complete Google's OAuth consent flow.
4. Select an accessible Merchant Center account.
5. Create or reuse an API product data source.
6. Configure and start product synchronization.
7. Review synchronization progress, the last successful run, and actionable product errors.

The Google Ads area remains visible but disabled with the message **Developer token required**. It performs no Ads API requests in this release.

## Scope boundaries

### Preserved

- Technical module name `psxmarketingwithgoogle`, so the installed module can be upgraded in place.
- PrestaShop module installation, enablement, hooks, tabs, database lifecycle, and configuration route.
- Existing catalog readers, product filters, product builders, carrier handling, feed mapping UI, and applicable Vue components.
- Existing Back Office authorization and employee permissions.

### Removed from runtime

- `ps_accounts` and its account presenter, tokens, shop UUID, UI component, and install dependency.
- PrestaShop Billing presenters, adapters, UI, remote subscription calls, and billing packages.
- `ps_eventbus` and CloudSync synchronization calls.
- PrestaShop-hosted Google onboarding and operational APIs.
- PrestaShop-hosted CDN assets; all production JavaScript and images ship locally.
- PrestaShop/Segment/Sentry telemetry from the module.
- PrestaShop account verification and PrestaShop subscription gates.

### Not included in the first release

- Google Ads account discovery, campaign creation, campaign reporting, or conversion API calls.
- Creation of a Merchant Center account on the user's behalf. The connected Google identity must already have access to at least one Merchant Center account.
- A Tiny Lux SaaS backend or shared cross-shop account service.
- Reimplementation of unrelated upstream features that do not participate in OAuth, Merchant Center, or product synchronization.
- Translation of the new Tiny Lux interface beyond English.

## Architectural approach

This is an in-place service-layer replacement, not a new module. The existing Vue application keeps its high-level account, Merchant Center, and product-feed state machines. Its HTTP client is redirected from PrestaShop-hosted endpoints to local module controllers that provide a narrow compatibility API.

The compatibility layer lets the existing interface and product-domain code remain stable while Google-specific operations move to server-side PHP services owned by the module.

### Components

#### 1. Tiny Lux configuration

A Back Office settings surface accepts the Google OAuth web-client JSON or equivalent Client ID and Client Secret fields. The attached development credential is injected into the dev shop during verification; it is never copied into source control or the distributable archive.

The module validates that the credential is a web client and that it has the expected redirect URI. The production callback is:

`https://thetinylux.com/module/tlgoogleshopping/oauth`

The module registers a route alias for `/module/tlgoogleshopping/oauth` that dispatches to the retained `psxmarketingwithgoogle` module's OAuth controller. This keeps the existing module identity while matching the configured Google OAuth callback.

The Client Secret and OAuth refresh token are encrypted before storage using authenticated encryption with a key derived from the shop secret. Plaintext secrets exist only in memory for the duration of a request. Access tokens are cached only until shortly before expiry.

#### 2. OAuth service

The OAuth service performs the web-server authorization-code flow. It requests identity scopes needed to show the connected account and `https://www.googleapis.com/auth/content` for Merchant API access. It requests offline access so scheduled synchronization can refresh access without an administrator being present.

Before redirecting to Google, the module stores a cryptographically random, single-use OAuth state record with a short expiry and the initiating employee/shop context. The callback rejects missing, expired, reused, or context-mismatched state before exchanging the authorization code.

Disconnecting Google revokes the token when possible, deletes stored credentials and account selections, and leaves catalog configuration intact so a later reconnection can resume safely.

#### 3. Merchant API adapter

The server-side adapter calls the supported Google Merchant API rather than the legacy PrestaShop onboarding service. It is responsible for:

- listing Merchant Center accounts accessible to the connected Google user;
- recording the administrator's selected account;
- detecting missing access or missing OAuth scope;
- checking the Google Cloud project/Merchant Center developer registration prerequisite;
- creating or reusing one primary API data source owned by the module;
- inserting, updating, listing, and deleting product inputs;
- returning normalized account, product, status, and error payloads to the Vue application.

Google resource names and IDs are stored explicitly. The adapter converts PrestaShop decimal prices to Merchant API micros at its boundary and uses the Merchant API product identity format based on content language, feed label, and offer ID.

#### 4. Local compatibility API

Authenticated Back Office AJAX controllers expose the subset of routes consumed by the retained Vue flows. They replace the current remote onboarding client while preserving response shapes where practical. Each endpoint enforces the current employee's module permission and shop context.

OAuth callbacks are public only to receive Google's authorization response. They accept no privileged operation without a valid one-time state record.

No browser response contains the Client Secret or refresh token. Browser-visible account data is limited to the connected Google profile, Merchant Center identifiers and synchronization status required by the interface.

#### 5. Product synchronization service

The service reuses existing product enumeration, filtering, mapping, carrier, price, language, and availability logic. It converts those internal product DTOs into Merchant API `ProductInput` payloads.

A synchronization run stores a durable job record with totals for pending, successful, failed, and skipped products. Work is processed in bounded batches to avoid PHP request timeouts. Each product result is idempotent for its offer identity, so a retry updates the same Merchant product instead of creating a duplicate.

Manual synchronization starts from the Back Office. Scheduled synchronization uses a dedicated front controller protected by a high-entropy cron token stored as an encrypted module setting. The recommended schedule is daily. Product data must also be refreshed often enough to avoid Google's product expiration window.

Failed products store a sanitized Google error code, field path, and operator-facing message. Retrying a job processes only failed and pending items unless the administrator explicitly requests a full resynchronization.

#### 6. Vue interface adaptation

The interface keeps the existing Google account, Merchant Center, mapping, feed, status, and issue components where their data contracts remain useful. It removes the PrestaShop Account, Billing, subscription, PrestaShop aggregator, and CloudSync-specific views and state.

The English interface uses Tiny Lux wording. The account card starts direct Google OAuth. The feed card reports local job progress. The Ads section has a deterministic disabled state until a Developer Token is added in a future release.

## Data flow

### Google connection

1. An authenticated employee requests a Google authorization URL from the local module controller.
2. The OAuth service creates and stores a one-time state record.
3. The browser redirects to Google.
4. Google returns to the route alias with `code` and `state`.
5. The callback validates and consumes state, exchanges the code server-side, encrypts the refresh token, and redirects to the module configuration page.
6. The module uses the access token to retrieve the connected profile and accessible Merchant Center accounts.

### Product synchronization

1. The administrator selects a Merchant Center account and an existing or new API data source.
2. The module creates a synchronization job from the active shop/language/feed configuration.
3. Existing catalog code enumerates and maps products in bounded batches.
4. The Merchant adapter uploads `ProductInput` records directly to Google.
5. The module persists per-product results and aggregate progress.
6. The Vue UI polls only the local job-status endpoint.
7. A retry resumes failed and pending records without duplicating successful products.

## Error handling

- Missing or invalid OAuth credentials: block connection and show a settings link without exposing credential values.
- Redirect URI mismatch: show the exact expected callback URI and retain no partial token state.
- OAuth denial: return safely to the module with a neutral cancellation message.
- Missing `content` scope: mark the connection incomplete and offer reconnection with the required scope.
- Expired or revoked refresh token: stop scheduled jobs, clear the usable-token state, and require reconnection.
- No Merchant Center accounts: keep Google connected and explain that the account needs Merchant Center access.
- Missing Merchant developer registration: show a specific prerequisite error and do not start a feed job.
- API quota or transient Google error: retry with bounded exponential backoff and preserve the job cursor.
- Permanent product validation error: do not retry automatically; display the affected product and field.
- Partial job failure: retain successful results and allow a failed-only retry.
- Cron authorization failure: return an authorization error without disclosing whether a job or account exists.

## Security and privacy

- Client credentials, refresh tokens, access tokens, cron tokens, authorization codes, and OAuth state values are redacted from application and web-server logs.
- Secrets are not committed, packaged, rendered into JavaScript, or returned from controllers.
- OAuth uses HTTPS, strict redirect URI matching, short-lived single-use state, and server-side code exchange.
- Administrative endpoints require authenticated Back Office access, module permission, CSRF protection, and the active shop context.
- Scheduled synchronization requires its dedicated high-entropy token and does not share a Back Office session.
- Stored tokens are deleted on disconnect and module uninstall.
- The release build includes a host allowlist test that rejects runtime references to PrestaShop account, Billing, CloudSync, PrestaShop Google API, CDN, Segment, or Sentry endpoints.

## Test strategy

Implementation follows test-driven development. Each replacement behavior begins with a focused failing test.

### PHP tests

- OAuth state creation, expiry, single use, and context mismatch.
- Secret encryption round trip and failure with tampered ciphertext.
- OAuth callback success, denial, invalid state, missing scope, and token-refresh failure.
- Merchant adapter request/response normalization, pagination, price conversion, and sanitized errors.
- Local controller authorization and compatibility response contracts.
- Product job creation, bounded batching, idempotent identities, partial failure, and failed-only retry.
- Cron authentication and job resumption.

### Vue tests

- Tiny Lux Google onboarding renders without PrestaShop Account or Billing controls.
- Google connection and Merchant account selection consume the local compatibility API.
- Feed progress and product errors render from durable local jobs.
- Google Ads remains disabled and makes no Ads request without a Developer Token.

### Release and integration tests

- Build production assets locally and package a single valid module root.
- Scan production PHP, JavaScript, templates, and configuration for forbidden PrestaShop service hosts and removed runtime packages.
- Install and enable the archive on the isolated PrestaShop 9.1.4 dev shop.
- Verify hook and tab registration, authenticated module rendering, storefront health, and absence of PHP/browser fatal errors.
- Verify that credentials are absent from Git, logs, browser payloads, and the archive.
- Exercise the public OAuth start/callback route with controlled invalid-state cases automatically.
- Complete live Google OAuth and Merchant Center verification interactively after the dev callback URI is authorized in Google Cloud.
- Run a small controlled product synchronization before a full catalog synchronization.

## Migration and rollback

The fork upgrades the installed `psxmarketingwithgoogle` module in place. The migration removes obsolete PrestaShop service configuration and creates local tables/settings for credentials, selected Merchant account, data source, jobs, and product results. It does not delete catalog configuration that can be reused by the direct integration.

Before installation, the current stable archive and the module's configuration/database state are backed up. If verification fails, restore the stable archive and configuration backup. A rollback does not attempt to recreate PrestaShop Account or CloudSync remote state.

## External prerequisites

- The Tiny Lux OAuth web client from Google Cloud remains enabled.
- Google Merchant API is enabled for the `the-tiny-lux` project.
- The production redirect URI remains exactly `https://thetinylux.com/module/tlgoogleshopping/oauth`.
- The connected Google user has access to a Merchant Center account.
- The Google Cloud project is registered with the selected Merchant Center account as required by Merchant API.
- For dev end-to-end OAuth, the active public dev callback URI must also be temporarily authorized in the Google OAuth client.
- Google Ads remains unavailable until Tiny Lux obtains and configures a Google Ads API Developer Token.

## Acceptance criteria

The release is accepted when:

1. the module installs and enables on PrestaShop 9.1.4 under its existing technical name;
2. the Back Office shows Tiny Lux Google with no PrestaShop Account or Billing gate;
3. production assets make no runtime request to a PrestaShop-owned account, Billing, CloudSync, Google-module API, CDN, Segment, or Sentry service;
4. Tiny Lux OAuth starts locally and the callback securely persists a refreshable Google connection;
5. accessible Merchant Center accounts can be listed and one can be selected;
6. an API data source can be created or reused;
7. a controlled product batch synchronizes directly to Merchant API and reports durable results;
8. retries do not duplicate successful products;
9. Google Ads makes no request and clearly reports its missing Developer Token prerequisite;
10. no credential or token is present in source control, release artifacts, logs, or browser-visible payloads; and
11. the storefront and unrelated Back Office areas remain healthy.
