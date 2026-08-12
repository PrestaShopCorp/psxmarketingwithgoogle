# PrestaShop 8.2.7 Compatibility Design

## Objective

Release Tiny Lux Google 2.0.1 as one installable module package that supports
PrestaShop 8.2.7 and PrestaShop 9.x without changing the direct Google account,
Merchant Center, catalog synchronization, OAuth, or cron behavior delivered in
2.0.0.

## Supported Runtime

- Minimum PrestaShop version: 8.2.7.
- Maximum PrestaShop version: the running PrestaShop release, preserving the
  module's existing forward-compatible declaration.
- Minimum PHP version: 8.1.
- Technical module name: `psxmarketingwithgoogle`.
- Release version: 2.0.1.

PrestaShop releases older than 8.2.7 remain outside the supported contract.

## Architecture

The project will continue to ship one source tree and one ZIP archive. Shared
services, repositories, database schema, direct Google API clients, OAuth state,
encrypted credentials, product synchronization, and cron processing remain
identical across supported PrestaShop versions.

Only framework integration points may branch on `_PS_VERSION_`. Existing legacy
branches, such as PrestaShop 8 Back Office template loading and menu styling,
will be retained. Any additional branch must be limited to a demonstrated
PrestaShop 8.2.7 versus 9.x lifecycle difference and covered by a focused test.

## Installation and Upgrade

Fresh installation on PrestaShop 8.2.7 and 9.x must:

1. accept the module compatibility declaration;
2. create the four Tiny Lux Google database tables;
3. install the visible Marketing tab and the required hidden admin controllers;
4. register module, header, order, cart, and public-route hooks;
5. expose the Tiny Lux Google Back Office application; and
6. avoid all removed PrestaShop Account and Billing dependencies.

The module version will be bumped from 2.0.0 to 2.0.1. An idempotent 2.0.1
upgrade step will ensure required hooks and controller tabs are present for an
existing 2.0.0 installation without deleting configuration, credentials, sync
jobs, or Merchant Center state.

## Request Flow

Back Office requests continue through the legacy module admin controllers on
both supported platform generations. The JSON API will require an authenticated
employee, a valid admin token, and view permission before dispatching to the
local Tiny Lux Google API.

Public OAuth and cron requests continue to use the stable
`/module/tlgoogleshopping/*` aliases while dispatching internally to the
technical `psxmarketingwithgoogle` module. OAuth failures must return a safe
redirect or controlled error, and unauthenticated cron requests must return a
generic authorization failure without exposing secrets.

## Packaging

The build will emit `psxmarketingwithgoogle-v2.0.1-tinylux.zip` and its SHA-256
checksum. Version metadata in the module class, `config.xml`, build script,
package contract, self-test fixtures, and user documentation must agree.

The archive must retain its existing security and readiness guarantees:

- production dependencies and compiled Back Office assets are included;
- development dependencies, tests, build sources, secrets, and credential files
  are excluded;
- no OAuth client secret or secret fingerprint appears in tracked files or the
  release archive; and
- identical source inputs produce an identical archive checksum.

## Error Handling

Installation or upgrade failures must return `false` and surface a useful module
error rather than leaving a reported-success partial installation. Version-
specific compatibility code must fail closed for authentication and cron
authorization. Existing encrypted configuration must not be overwritten during
upgrade.

## Verification

Implementation will follow test-driven development. Compatibility and release
contract tests will be added first and observed failing before production code
changes.

Automated verification will include:

- the complete PHP unit and integration harness;
- focused compatibility, installer, controller, route, and upgrade tests;
- package contract and malicious-archive self-tests;
- runtime network and secret scans;
- deterministic archive rebuild and checksum comparison; and
- browser smoke tests scoped to Tiny Lux Google requests.

Runtime verification will use two isolated dev shops:

- a new PrestaShop 8.2.7 installation for fresh install and end-to-end checks;
- the existing PrestaShop 9.1.4 installation for upgrade/regression checks.

For each shop, verification must confirm the active module version, database
tables, tabs, hooks, Back Office application load, authenticated local API,
public OAuth route, protected cron route, and absence of new application-level
errors in relevant logs.

## Non-Goals

- Supporting PrestaShop versions older than 8.2.7.
- Reintroducing PrestaShop Account, Billing, Marketplace, or Distribution API
  dependencies.
- Creating separate PrestaShop 8 and PrestaShop 9 module forks.
- Changing Google OAuth credentials, Merchant Center configuration, catalog
  mapping, synchronization semantics, or the Back Office product experience.
- Modifying or replacing the existing PrestaShop 9 dev environment merely to
  create the PrestaShop 8 test environment.
