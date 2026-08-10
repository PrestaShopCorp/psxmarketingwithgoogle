![Tiny Lux Google](views/img/google-icon.svg)

# Tiny Lux Google 2.0.0

Tiny Lux Google is an in-place fork of the `psxmarketingwithgoogle` module. It
connects a shop directly to Google OAuth, Merchant Center, and Merchant API v1.
It does not use a PrestaShop Account, Billing, CloudSync, EventBus, Segment, or
Sentry service.

Google Ads is deliberately unavailable in 2.0.0. The Back Office shows
**Developer token required** and makes no Google Ads API request.

## Requirements

- PrestaShop 9.1.4 (PHP 8.1 or newer).
- An HTTPS shop URL that Google can reach.
- A Google Cloud OAuth 2.0 **Web application** client.
- Merchant API enabled in that Google Cloud project.
- A Google user with access to an existing Merchant Center account.
- The Cloud project registered for Merchant API access with that Merchant
  Center account.

## Install or upgrade

The technical module name remains `psxmarketingwithgoogle`, so 2.0.0 upgrades
the existing module in place.

For a fresh installation, upload
`psxmarketingwithgoogle-v2.0.0-tinylux.zip` in the Back Office module manager,
then install and enable **Tiny Lux Google**.

Before upgrading an existing installation:

1. Back up the current module directory, database, and module configuration.
2. Disable `psxmarketingwithgoogle`.
3. Replace its directory with the single `psxmarketingwithgoogle/` directory
   extracted from the 2.0.0 archive.
4. Run the module upgrade and clear the application cache.
5. Enable the module and confirm that its version is `2.0.0`.

For a console-managed shop, steps 4 and 5 are:

```bash
php bin/console prestashop:module upgrade psxmarketingwithgoogle --no-interaction
php bin/console cache:clear --no-warmup
php bin/console prestashop:module enable psxmarketingwithgoogle --no-interaction
```

The 2.0.0 migration creates encrypted connection/state storage and durable sync
job/item tables. Do not delete the existing catalog configuration during an
upgrade.

## Configure Google OAuth callbacks

In Google Cloud Console, open the Web application OAuth client and add the
appropriate value under **Authorized redirect URIs**. This server-side flow
does not require an Authorized JavaScript origin.

Production must use this exact callback:

```text
https://thetinylux.com/module/tlgoogleshopping/oauth
```

For a public development shop at `dev-shop.example`, use:

```text
https://dev-shop.example/module/tlgoogleshopping/oauth
```

If the shop is installed below a base path, that path precedes `/module/...`.
The canonical value is the exact HTTPS callback displayed in the Tiny Lux
Google credential card. Set the shop's public SSL domain first, add that exact
value to the Google client, and ensure the downloaded JSON lists it in
`web.redirect_uris` before importing the file. A localhost callback is not a
substitute for the public development callback.

## Import credentials securely

Open **Tiny Lux Google** in the Back Office. In **Google OAuth web client**,
select the downloaded Web-client JSON. The authenticated local controller
validates the file and callback, encrypts the Client Secret with the shop key,
and invalidates any connection that belonged to a previous client. The secret
and refresh token are never returned to the browser after storage.

The credential JSON is deployment input only:

- never copy it into the module directory;
- never commit it or place it in a release archive;
- do not paste it into logs, tickets, command history, or screenshots; and
- delete temporary server/container copies immediately after successful
  encrypted import.

After import, select **Sign in with Google**, complete consent, select the
intended Merchant Center account, and create or reuse the module's API data
source.

## Controlled product synchronization

Start with a small manual job from the product-feed area. Process a bounded
batch, review its succeeded/failed/skipped/pending totals, and confirm the offer
IDs in Merchant Center before scheduling the full catalog. Retrying a partial
job processes failed and pending items only; successful offer identities are
not duplicated.

Permanent product validation errors must be corrected in the catalog or
mapping before retry. Transient Merchant errors use bounded backoff.

## Protected cron

Credential import creates a high-entropy, encrypted per-shop cron token. It is
intentionally excluded from browser responses. A trusted deployment operator
must transfer it directly from server-side secret provisioning to the
scheduler's secret store without logging it.

Run the protected endpoint daily (and often enough to keep Merchant product
data current):

```text
GET https://<shop-host>/module/psxmarketingwithgoogle/cron?shop=<shop-id>&token=<secret>&limit=25
```

The route also has the public alias `/module/tlgoogleshopping/cron`. `shop` and
`limit` are positive integers; the batch limit is capped at 25. Treat the full
URL as a secret because its query contains the token. Configure the reverse
proxy and scheduler to redact the query string from access logs. A failed
authorization response does not reveal whether a shop, job, or account exists.

## Build and verify the release

Node 20+, pnpm 8.15.9, Composer 2, PHP, a JDK `jar` command, `unzip`, `zipinfo`,
and `rg` are required. Docker runs the pinned Node builder.

```bash
scripts/build-ready-package.sh
tests/package-ready-contract.sh dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip
sha256sum -c dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip.sha256
tests/runtime-network-contract.sh
```

The package build compiles all local UI and auxiliary assets, creates a
production-only authoritative Composer autoloader, and rejects source/dev/test
material, maps, logs, credential files, removed runtime dependencies, forbidden
service hosts, and plaintext credential patterns.

The public browser smoke is environment-driven and never starts OAuth or a
sync:

```bash
TINY_LUX_ADMIN_URL='https://<public-host>/<admin-path>/?controller=AdminPsxMktgWithGoogleModule' \
TINY_LUX_STOREFRONT_URL='https://<public-host>/' \
TINY_LUX_ADMIN_EMAIL='<back-office-email>' \
TINY_LUX_ADMIN_PASSWORD='<back-office-password>' \
TINY_LUX_BASIC_AUTH_USER='<optional-user>' \
TINY_LUX_BASIC_AUTH_PASSWORD='<optional-password>' \
TINY_LUX_PLAYWRIGHT_ROOT='/path/to/repository-with-playwright' \
node tests/browser/tiny-lux-google-smoke.mjs
```

Omit both Basic Auth variables when the public shop does not use Basic Auth.
`TINY_LUX_PLAYWRIGHT_ROOT` is optional when `playwright` resolves from the
current workspace.

## Rollback

If migration or verification fails:

1. disable the 2.0.0 module;
2. restore the backed-up module directory;
3. restore the pre-upgrade module configuration and affected module tables;
4. clear the application cache; and
5. enable the previous stable module and verify the storefront and Back Office.

Do not delete the shared shop database volume or unrelated shop data. Preserve
the failed 2.0.0 database backup for diagnosis, but never place its encrypted
or plaintext credential material in source control or a support attachment.

## License

Academic Free License 3.0.
