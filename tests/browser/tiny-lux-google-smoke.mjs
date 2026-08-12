import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

import {
  allowedShopHosts,
  assertAllowedShopUrl,
  localApiControllerTarget,
  localApiResponseIsExpected,
  loginIfNeeded,
  moduleRequestIsForbidden,
  pageErrorsBelongToModule,
  requestBelongsToModule,
  requestOwnerUrl,
  unexpectedBrowserErrors,
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

async function openModule(page, adminUrl, beforeModuleNavigation) {
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
  if (!(await visible(moduleLink))) {
    const marketingMenu = page.locator('a').filter({ hasText: /Marketing/i }).filter({ visible: true }).first();
    assert.equal(await visible(marketingMenu), true, 'Marketing Back Office menu is missing');
    await marketingMenu.click();
    await moduleLink.waitFor({ state: 'visible' });
  }
  assert.equal(await visible(moduleLink), true, 'Tiny Lux Google Back Office link is missing');
  beforeModuleNavigation();
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
  const forbiddenRequestDetails = new Set();
  const preExistingExternalFrameHosts = new Set();
  const localApiResponseTasks = [];
  const observedPages = new WeakSet();
  const ignoredErrorPages = new WeakSet();

  const observePage = (observedPage) => {
    if (observedPages.has(observedPage)) {
      return;
    }
    observedPages.add(observedPage);
    observedPage.on('console', (message) => {
      if (message.type() === 'error'
        && pageErrorsBelongToModule(observedPage, ignoredErrorPages)) {
        let source = 'none';
        try {
          const location = new URL(message.location().url);
          source = `${location.host}${location.pathname}`;
        } catch {
          // Keep the safe placeholder.
        }
        const messageText = sanitize(message.text());
        browserErrors.push({
          kind: 'console',
          message: messageText,
          localApiTarget: localApiControllerTarget(message.location().url),
          detail: `console [${source}]: ${messageText}`,
        });
      }
    });
    observedPage.on('pageerror', (error) => {
      if (pageErrorsBelongToModule(observedPage, ignoredErrorPages)) {
        const messageText = sanitize(error.message);
        browserErrors.push({
          kind: 'page',
          message: messageText,
          localApiTarget: null,
          detail: `page: ${messageText}`,
        });
      }
    });
  };
  context.on('page', observePage);
  observePage(page);

  context.on('requestfailed', (request) => {
    let frameUrl = null;
    try {
      frameUrl = request.frame().url();
    } catch {
      // Service-worker and browser requests are intentionally evaluated fail-closed.
    }
    let serviceWorkerUrl = null;
    try {
      serviceWorkerUrl = request.serviceWorker()?.url() ?? null;
    } catch {
      // Keep the owner unknown so the request is evaluated fail-closed.
    }
    const ownerUrl = requestOwnerUrl(frameUrl, serviceWorkerUrl);
    if (!requestBelongsToModule(ownerUrl, allowedHosts)) {
      return;
    }
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
      let frameUrl = null;
      try {
        frameUrl = request.frame().url();
      } catch {
        // Service-worker and browser requests are intentionally evaluated fail-closed.
      }
      let serviceWorkerUrl = null;
      try {
        serviceWorkerUrl = request.serviceWorker()?.url() ?? null;
      } catch {
        // Keep the owner unknown so the request is evaluated fail-closed.
      }
      const ownerUrl = requestOwnerUrl(frameUrl, serviceWorkerUrl);
      if (moduleRequestIsForbidden(request.url(), ownerUrl, allowedHosts, {
        resourceType: request.resourceType(),
        preExistingExternalFrameHosts,
      })) {
        forbiddenHosts.add(hostname.toLowerCase());
        let frameHost = 'none';
        try {
          frameHost = new URL(ownerUrl).host.toLowerCase() || 'none';
        } catch {
          // Keep the safe placeholder.
        }
        forbiddenRequestDetails.add(
          `${hostname.toLowerCase()} [${request.resourceType()}; frame=${frameHost}]`,
        );
      }
    } catch {
      forbiddenHosts.add('invalid-host');
    }
  });
  context.on('response', (response) => {
    try {
      const responseUrl = new URL(response.url());
      if (responseUrl.searchParams.get('controller') === 'AdminTinyLuxGoogleApi') {
        localApiResponseTasks.push((async () => {
          let internalMethod = '';
          let internalPath = '';
          try {
            const envelope = response.request().postDataJSON();
            internalMethod = typeof envelope?.method === 'string' ? envelope.method : '';
            internalPath = typeof envelope?.path === 'string' ? envelope.path : '';
          } catch {
            // Invalid or missing envelopes fail the response contract below.
          }

          let responseCode = '';
          try {
            const body = await response.json();
            if (typeof body?.code === 'string' && /^[a-z0-9_]{1,64}$/.test(body.code)) {
              responseCode = body.code;
            }
          } catch {
            // Non-JSON responses fail the response contract below.
          }

          return {
            internalMethod,
            internalPath,
            status: response.status(),
            contentType: response.headers()['content-type'] ?? '',
            responseCode,
            localApiTarget: localApiControllerTarget(response.url()),
          };
        })());
      }
    } catch {
      // Invalid response URLs are already handled by the request host policy.
    }
  });

  try {
    const moduleRoot = await openModule(page, adminUrl, () => {
      preExistingExternalFrameHosts.clear();
      for (const frame of page.frames()) {
        try {
          const frameUrl = new URL(frame.url());
          if (/^https?:$/.test(frameUrl.protocol)
            && !allowedHosts.has(frameUrl.host.toLowerCase())) {
            preExistingExternalFrameHosts.add(frameUrl.host.toLowerCase());
          }
        } catch {
          // Empty and non-HTTP frame URLs are not external host exceptions.
        }
      }
      browserErrors.length = 0;
      failedRequests.length = 0;
      forbiddenHosts.clear();
      forbiddenRequestDetails.clear();
      localApiResponseTasks.length = 0;
    });
    await moduleRoot.waitFor({ state: 'visible' });
    await moduleRoot.getByText('Developer token required', { exact: false }).first().waitFor({
      state: 'visible',
      timeout: 15000,
    });

    assertAllowedShopUrl(page.url(), allowedHosts, 'Back Office');
    assert.equal(new URL(page.url()).host.toLowerCase(), adminUrl.host.toLowerCase(),
      'Back Office page left the expected admin host');
    assert.match(await page.title(), /Tiny Lux|Google/i, 'Back Office page identity is incorrect');

    const moduleText = (await moduleRoot.innerText()).trim();
    assert.ok(moduleText.length > 80, 'Tiny Lux Google module rendered a blank shell');
    assert.match(moduleText, /Tiny Lux Google/);
    assert.match(moduleText, /Connect your Google account/);
    assert.match(moduleText, /Developer token required/);
    assert.doesNotMatch(moduleText, /PrestaShop/i);
    assert.doesNotMatch(moduleText, /Billing information/i);
    assert.doesNotMatch(moduleText, /CloudSync/i);
    const localApiResponses = await Promise.all(localApiResponseTasks);
    assert.ok(localApiResponses.length > 0, 'Tiny Lux Google made no local API requests');
    assert.equal(
      localApiResponses.every(localApiResponseIsExpected),
      true,
      'Tiny Lux Google local API returned an unexpected response',
    );

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
    ignoredErrorPages.add(storefrontPage);
    observePage(storefrontPage);
    const storefrontResponse = await storefrontPage.goto(storefrontUrl.href, {
      waitUntil: 'domcontentloaded',
    });
    assert.notEqual(storefrontResponse, null, 'Storefront navigation returned no HTTP response');
    assert.equal(storefrontResponse.status(), 200, 'Storefront did not return HTTP 200');
    assertAllowedShopUrl(storefrontPage.url(), allowedHosts, 'Storefront');

    assert.deepEqual(
      [...forbiddenHosts],
      [],
      `A forbidden runtime hostname was requested: ${[...forbiddenRequestDetails].join(', ')}`,
    );
    assert.deepEqual(
      failedRequests,
      [],
      `One or more browser requests failed: ${failedRequests.join(', ')}`,
    );
    const unhandledBrowserErrors = unexpectedBrowserErrors(browserErrors, localApiResponses);
    assert.deepEqual(
      unhandledBrowserErrors,
      [],
      `The module emitted browser errors: ${unhandledBrowserErrors.slice(0, 10).join('; ')}`,
    );
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
