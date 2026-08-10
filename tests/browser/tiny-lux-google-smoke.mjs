import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

import {
  allowedShopHosts,
  assertAllowedShopUrl,
  requestedHostIsForbidden,
} from './tiny-lux-google-smoke-helpers.mjs';

const require = createRequire(import.meta.url);
const secretValues = [
  process.env.TINY_LUX_ADMIN_EMAIL,
  process.env.TINY_LUX_ADMIN_PASSWORD,
  process.env.TINY_LUX_BASIC_AUTH_USER,
  process.env.TINY_LUX_BASIC_AUTH_PASSWORD,
].filter(Boolean);

function env(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function publicUrl(name) {
  const value = new URL(env(name));
  assert.match(value.protocol, /^https?:$/, `${name} must use HTTP or HTTPS`);
  value.username = '';
  value.password = '';
  return value;
}

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    const runtimeRoot = process.env.TINY_LUX_PLAYWRIGHT_ROOT?.trim();
    if (!runtimeRoot) {
      throw new Error(
        'Playwright is unavailable; install workspace dependencies or set TINY_LUX_PLAYWRIGHT_ROOT to a repository directory containing node_modules/playwright.',
      );
    }

    const modulePath = path.basename(runtimeRoot) === 'node_modules'
      ? path.join(runtimeRoot, 'playwright')
      : path.join(runtimeRoot, 'node_modules', 'playwright');
    return require(modulePath);
  }
}

function sanitize(value) {
  let output = String(value ?? '');
  for (const secret of secretValues) {
    output = output.split(secret).join('[redacted]');
  }
  return output
    .replace(/https?:\/\/[^\s)\]}>'"]+/gi, '[redacted-url]')
    .replace(/([?&](?:token|_token|code|state)=)[^&\s]+/gi, '$1[redacted]');
}

function visible(locator) {
  return locator.isVisible().catch(() => false);
}

async function loginIfNeeded(page, email, password) {
  const emailInput = page.locator('input[type="email"], #email').first();
  const passwordInput = page.locator('input[type="password"], #passwd').first();
  if (!(await visible(emailInput)) || !(await visible(passwordInput))) {
    return;
  }

  await emailInput.fill(email);
  await passwordInput.fill(password);
  const submit = page.locator(
    'button[type="submit"], #submit_login, input[type="submit"]',
  ).first();
  assert.equal(await visible(submit), true, 'Back Office login submit control is missing');
  await submit.click();
  await page.waitForLoadState('domcontentloaded');
}

async function openModule(page, adminUrl) {
  await page.goto(adminUrl.href, { waitUntil: 'domcontentloaded' });
  await loginIfNeeded(
    page,
    env('TINY_LUX_ADMIN_EMAIL'),
    env('TINY_LUX_ADMIN_PASSWORD'),
  );

  const moduleRoot = page.locator('#psxMktgWithGoogleApp');
  if (await visible(moduleRoot)) {
    return moduleRoot;
  }

  const moduleLink = page.locator(
    'a[href*="AdminPsxMktgWithGoogleModule"], a[href*="psxmarketingwithgoogle"]',
  ).filter({ hasText: /Tiny Lux Google|Google/i }).first();
  assert.equal(await visible(moduleLink), true, 'Tiny Lux Google Back Office link is missing');
  await moduleLink.click();
  await page.waitForLoadState('domcontentloaded');
  return moduleRoot;
}

async function main() {
  const adminUrl = publicUrl('TINY_LUX_ADMIN_URL');
  const storefrontUrl = publicUrl('TINY_LUX_STOREFRONT_URL');
  const allowedHosts = allowedShopHosts(adminUrl, storefrontUrl);
  const basicUser = process.env.TINY_LUX_BASIC_AUTH_USER?.trim();
  const basicPassword = process.env.TINY_LUX_BASIC_AUTH_PASSWORD?.trim();
  assert.equal(
    Boolean(basicUser),
    Boolean(basicPassword),
    'Basic Auth user and password must be provided together',
  );

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: process.env.TINY_LUX_IGNORE_HTTPS_ERRORS === '1',
    ...(basicUser ? {
      httpCredentials: { username: basicUser, password: basicPassword },
    } : {}),
  });
  const page = await context.newPage();
  const browserErrors = [];
  const failedRequests = [];
  const forbiddenHosts = new Set();
  const observedPages = new WeakSet();

  const observePage = (observedPage) => {
    if (observedPages.has(observedPage)) {
      return;
    }
    observedPages.add(observedPage);
    observedPage.on('console', (message) => {
      if (message.type() === 'error') {
        browserErrors.push(`console: ${sanitize(message.text())}`);
      }
    });
    observedPage.on('pageerror', (error) => {
      browserErrors.push(`page: ${sanitize(error.message)}`);
    });
  };
  context.on('page', observePage);
  observePage(page);

  context.on('requestfailed', (request) => {
    let hostname = 'invalid-host';
    try {
      hostname = new URL(request.url()).host;
    } catch {
      // Keep the safe placeholder; never retain a request URL.
    }
    failedRequests.push(`${request.method()} ${hostname}`);
  });
  context.on('request', (request) => {
    try {
      const hostname = new URL(request.url()).host;
      if (requestedHostIsForbidden(request.url(), allowedHosts)) {
        forbiddenHosts.add(hostname.toLowerCase());
      }
    } catch {
      forbiddenHosts.add('invalid-host');
    }
  });

  try {
    const moduleRoot = await openModule(page, adminUrl);
    await moduleRoot.waitFor({ state: 'visible' });

    assertAllowedShopUrl(page.url(), allowedHosts, 'Back Office');
    assert.equal(new URL(page.url()).host.toLowerCase(), adminUrl.host.toLowerCase(),
      'Back Office page left the expected admin host');
    assert.match(await page.title(), /Tiny Lux|Google/i, 'Back Office page identity is incorrect');

    const moduleText = (await moduleRoot.innerText()).trim();
    assert.ok(moduleText.length > 80, 'Tiny Lux Google module rendered a blank shell');
    assert.match(moduleText, /Tiny Lux Google/);
    assert.match(moduleText, /Sign in with Google/);
    assert.match(moduleText, /Developer token required/);
    assert.doesNotMatch(moduleText, /PrestaShop/i);
    assert.doesNotMatch(moduleText, /Billing information/i);
    assert.doesNotMatch(moduleText, /CloudSync/i);

    const overlaySelectors = [
      'vite-error-overlay',
      '#webpack-dev-server-client-overlay',
      'nextjs-portal',
      '[data-nextjs-dialog-overlay]',
    ];
    for (const selector of overlaySelectors) {
      assert.equal(await visible(page.locator(selector).first()), false,
        'A framework error overlay is visible');
    }
    const screenshot = await page.screenshot({ fullPage: false });
    assert.ok(screenshot.byteLength > 1000, 'Browser screenshot evidence is empty');

    // Focus is a real, side-effect-free interaction. In particular, this smoke
    // never clicks the OAuth, synchronization, disconnect, or credential controls.
    const safeControl = moduleRoot.locator(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])',
    ).first();
    assert.ok(await safeControl.count(), 'Tiny Lux Google has no interactive control');
    await safeControl.focus();
    assert.equal(await safeControl.evaluate((element) => element === document.activeElement), true,
      'The module did not respond to a focus interaction');

    const storefrontPage = await context.newPage();
    observePage(storefrontPage);
    const storefrontResponse = await storefrontPage.goto(storefrontUrl.href, {
      waitUntil: 'domcontentloaded',
    });
    assert.notEqual(storefrontResponse, null, 'Storefront navigation returned no HTTP response');
    assert.equal(storefrontResponse.status(), 200, 'Storefront did not return HTTP 200');
    assertAllowedShopUrl(storefrontPage.url(), allowedHosts, 'Storefront');

    assert.deepEqual([...forbiddenHosts], [], 'A forbidden runtime hostname was requested');
    assert.deepEqual(failedRequests, [], 'One or more browser requests failed');
    assert.deepEqual(browserErrors, [], 'The module emitted browser errors');
  } finally {
    await context.close();
    await browser.close();
  }

  process.stdout.write(
    'Tiny Lux Google smoke passed: module identity, local UI, storefront, network, and safe interaction.\n',
  );
}

main().catch((error) => {
  const firstSafeLine = sanitize(error?.message ?? error).split(/\r?\n/, 1)[0];
  process.stderr.write(`Tiny Lux Google smoke failed: ${firstSafeLine}\n`);
  process.exitCode = 1;
});
