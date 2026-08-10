# Marketing with Google Dev Readiness Design

**Date:** 2026-08-10

**Status:** Approved

**Upstream:** `PrestaShopCorp/psxmarketingwithgoogle`

**Release baseline:** `v1.75.6`

## Objective

Produce a reproducible, installable archive of the official stable Marketing with Google module and prove that it installs and loads correctly on the isolated Tiny Lux PrestaShop 9.1.4 development shop. Preserve upstream behavior and make only narrowly scoped compatibility or packaging changes if verification exposes a blocker.

## Approaches Considered

1. **Build the stable tag locally (selected).** Reproduce the upstream release workflow from `v1.75.6`, verify the result, install it on the dev shop, and fix only demonstrated blockers. This provides a stable baseline and auditable artifact.
2. **Use the current `master` prerelease.** This would test `v1.76.0-beta.1`, but introduces prerelease risk and does not match the request for a ready-to-use module as well as the stable tag.
3. **Download the published release archive.** This is the fastest installation path but does not prove that the linked source repository can be built reproducibly in the workspace.

## Build and Packaging

- Use Node 20 or newer with the repository's pinned pnpm lockfile.
- Run the JavaScript workspace install and production builds.
- Install Composer development dependencies long enough to generate guarded `index.php` files and run PHP verification.
- Reinstall Composer dependencies with `--no-dev` and optimized authoritative autoloading for the release artifact.
- Package one top-level `psxmarketingwithgoogle/` directory.
- Exclude Git metadata, developer-only UI sources, local caches, test output, build tooling, and credentials.
- Write the final archive to `dist/psxmarketingwithgoogle-v1.75.6-ready.zip` and record its SHA-256 digest.

## Change Policy

The stable upstream source is the compatibility baseline. No feature redesign or Google integration replacement is in scope. If a build, install, or PrestaShop 9.1.4 runtime failure occurs:

1. reproduce it with the narrowest automated check available;
2. add a regression test or packaging contract that fails for the demonstrated reason;
3. implement the smallest compatible fix;
4. rerun focused and full verification.

Generated dependencies and production assets are build outputs, not hand-edited source changes.

## Dev-Shop Installation

- Use the existing isolated PrestaShop 9.1.4 Docker shop at `http://localhost:8080`.
- Copy or extract the built archive into the shop's persistent module directory without changing the Tiny Lux production repository or its Compose configuration.
- Install through PrestaShop's module lifecycle command or API, clear cache, and confirm the module is enabled.
- Do not connect real Google, Merchant Center, Ads, or PrestaShop Accounts credentials during automated verification.

## Verification

Local source and package gates:

- Composer dependency resolution and production autoload generation;
- JavaScript production build;
- PHP unit tests;
- JavaScript unit tests and linting where supported by the pinned toolchain;
- PHP syntax checks and coding-standard dry run;
- archive-root, required-file, version-consistency, forbidden-file, and autoload checks.

PrestaShop 9.1.4 smoke gates:

- the shop remains healthy before and after installation;
- PrestaShop discovers, installs, and enables `psxmarketingwithgoogle` version `1.75.6`;
- module-owned database setup and required hook registration complete;
- the module configuration route loads for an authenticated back-office employee without a PHP fatal error or HTTP 5xx response;
- the storefront loads without a PHP fatal error after the module's front-office hooks are active;
- uninstall/reinstall is exercised if it can be done without losing unrelated dev-shop state.

External account onboarding is explicitly reported as unverified because it requires real third-party credentials and network-side account state.

## Safety and Workspace Boundaries

- Operate only on the dedicated module checkout and isolated dev-shop containers/volumes.
- Preserve unrelated changes in the Tiny Lux repository.
- Do not reset or delete shared shop volumes.
- Do not persist back-office credentials, OAuth tokens, API credentials, or generated session URLs in the module archive or Git history.

## Deliverables

- a clean stable-source branch containing only necessary source/tests/docs changes;
- `dist/psxmarketingwithgoogle-v1.75.6-ready.zip`;
- a SHA-256 checksum;
- fresh command output documenting build, automated test, package, installation, back-office, and storefront results;
- a concise list of any verification boundary that still requires real Google or PrestaShop account credentials.
