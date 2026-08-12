import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

let helpers = {};
let importFailure = null;
try {
  helpers = await import(pathToFileURL(
    new URL('./tiny-lux-google-smoke-helpers.mjs', import.meta.url).pathname,
  ));
} catch (error) {
  importFailure = error;
}

test('shop hosts are exact exceptions to forbidden service substrings', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const allowed = helpers.allowedShopHosts(
    new URL('https://prestashop-dev.shop.example/admin'),
    new URL('https://store.shop.example/'),
  );

  assert.equal(
    helpers.requestedHostIsForbidden('https://prestashop-dev.shop.example/assets/app.js', allowed),
    false,
  );
  assert.equal(
    helpers.requestedHostIsForbidden('https://api.prestashop.example/collect', allowed),
    true,
  );
  assert.equal(
    helpers.requestedHostIsForbidden('https://accounts.google.com/o/oauth2/auth', allowed),
    false,
  );
});

test('final shop URL validation rejects prefix lookalikes and non-HTTP URLs', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const allowed = helpers.allowedShopHosts(
    new URL('https://admin.shop.example/admin'),
    new URL('https://store.shop.example/'),
  );

  assert.doesNotThrow(() => helpers.assertAllowedShopUrl(
    'https://store.shop.example/category',
    allowed,
    'Storefront',
  ));
  assert.throws(
    () => helpers.assertAllowedShopUrl(
      'https://store.shop.example.evil.invalid/category',
      allowed,
      'Storefront',
    ),
    /left the expected shop hosts/,
  );
  assert.throws(
    () => helpers.assertAllowedShopUrl('data:text/plain,escaped', allowed, 'Storefront'),
    /HTTP or HTTPS/,
  );
});

test('malformed request URLs fail closed', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const allowed = helpers.allowedShopHosts(
    new URL('https://admin.shop.example/admin'),
    new URL('https://store.shop.example/'),
  );

  assert.equal(helpers.requestedHostIsForbidden('not a URL', allowed), true);
});

test('forbidden descendant traffic from an external back-office frame is outside module scope', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const allowed = helpers.allowedShopHosts(
    new URL('https://admin.shop.example/admin'),
    new URL('https://store.shop.example/'),
  );

  assert.equal(
    helpers.moduleRequestIsForbidden(
      'https://in.eu2.segmentapis.com/v1/p',
      'https://mbo.prestashop.com/',
      allowed,
    ),
    false,
  );
  assert.equal(
    helpers.moduleRequestIsForbidden(
      'https://in.eu2.segmentapis.com/v1/p',
      'https://admin.shop.example/admin/module',
      allowed,
    ),
    true,
  );
  assert.equal(
    helpers.moduleRequestIsForbidden(
      'https://in.eu2.segmentapis.com/v1/p',
      null,
      allowed,
    ),
    true,
  );
});

test('only a pre-existing external back-office frame document reload is outside module scope', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const allowed = helpers.allowedShopHosts(
    new URL('https://admin.shop.example/admin'),
    new URL('https://store.shop.example/'),
  );
  const preExistingExternalFrameHosts = new Set(['mbo.prestashop.com']);

  assert.equal(
    helpers.moduleRequestIsForbidden(
      'https://mbo.prestashop.com/',
      'https://admin.shop.example/admin/module',
      allowed,
      { resourceType: 'document', preExistingExternalFrameHosts },
    ),
    false,
  );
  assert.equal(
    helpers.moduleRequestIsForbidden(
      'https://mbo.prestashop.com/api/collect',
      'https://admin.shop.example/admin/module',
      allowed,
      { resourceType: 'fetch', preExistingExternalFrameHosts },
    ),
    true,
  );
  assert.equal(
    helpers.moduleRequestIsForbidden(
      'https://mbo.prestashop.com/runtime.js',
      null,
      allowed,
      { resourceType: 'script', preExistingExternalFrameHosts },
    ),
    false,
  );
  assert.equal(
    helpers.moduleRequestIsForbidden(
      'https://mbo.prestashop.com/runtime.js',
      'about:blank',
      allowed,
      { resourceType: 'script', preExistingExternalFrameHosts },
    ),
    false,
  );
});

test('request scope excludes descendant traffic owned by an external frame', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const allowed = helpers.allowedShopHosts(
    new URL('https://admin.shop.example/admin'),
    new URL('https://store.shop.example/'),
  );

  assert.equal(
    helpers.requestBelongsToModule(
      'https://mbo.prestashop.com/',
      allowed,
    ),
    false,
  );
  assert.equal(
    helpers.requestBelongsToModule(
      'https://admin.shop.example/admin/module',
      allowed,
    ),
    true,
  );
  assert.equal(helpers.requestBelongsToModule(null, allowed), true);
});

test('service worker URL owns requests that have no attributable page frame', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');

  assert.equal(
    helpers.requestOwnerUrl('about:blank', 'https://mbo.prestashop.com/service-worker.js'),
    'https://mbo.prestashop.com/service-worker.js',
  );
  assert.equal(
    helpers.requestOwnerUrl(null, 'https://mbo.prestashop.com/service-worker.js'),
    'https://mbo.prestashop.com/service-worker.js',
  );
  assert.equal(
    helpers.requestOwnerUrl(
      'https://admin.shop.example/admin/module',
      'https://mbo.prestashop.com/service-worker.js',
    ),
    'https://admin.shop.example/admin/module',
  );
});

test('explicit storefront page errors are outside the module error scope', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const adminPage = {};
  const storefrontPage = {};
  const ignoredPages = new WeakSet([storefrontPage]);

  assert.equal(helpers.pageErrorsBelongToModule(adminPage, ignoredPages), true);
  assert.equal(helpers.pageErrorsBelongToModule(storefrontPage, ignoredPages), false);
});

test('local API response contract accepts JSON 2xx and the exact unconfigured OAuth response', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');

  assert.equal(helpers.localApiResponseIsExpected({
    internalMethod: 'GET',
    internalPath: 'settings/status',
    status: 200,
    contentType: 'application/json; charset=utf-8',
    responseCode: '',
  }), true);
  assert.equal(helpers.localApiResponseIsExpected({
    internalMethod: 'GET',
    internalPath: 'oauth/authorized-url',
    status: 412,
    contentType: 'application/json; charset=utf-8',
    responseCode: 'google_not_configured',
  }), true);
});

test('local API response contract rejects every other non-2xx response', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const invalidResponses = [
    {
      internalMethod: 'POST',
      internalPath: 'oauth/authorized-url',
      status: 412,
      contentType: 'application/json',
      responseCode: 'google_not_configured',
    },
    {
      internalMethod: 'GET',
      internalPath: 'oauth',
      status: 412,
      contentType: 'application/json',
      responseCode: 'google_not_configured',
    },
    {
      internalMethod: 'GET',
      internalPath: 'oauth/authorized-url',
      status: 412,
      contentType: 'text/html',
      responseCode: 'google_not_configured',
    },
    {
      internalMethod: 'GET',
      internalPath: 'oauth/authorized-url',
      status: 412,
      contentType: 'application/json',
      responseCode: 'internal_error',
    },
    {
      internalMethod: 'GET',
      internalPath: 'oauth/authorized-url',
      status: 500,
      contentType: 'application/json',
      responseCode: 'google_not_configured',
    },
  ];

  for (const response of invalidResponses) {
    assert.equal(helpers.localApiResponseIsExpected(response), false);
  }
});

test('only the correlated Chromium diagnostic for an expected OAuth 412 is suppressed', () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const localApiTarget = 'https://admin.shop.example/admin/index.php?controller=AdminTinyLuxGoogleApi';
  const chromiumDiagnostic = 'Failed to load resource: the server responded with a status of 412 (Precondition Failed)';
  const expectedResponse = {
    internalMethod: 'GET',
    internalPath: 'oauth/authorized-url',
    status: 412,
    contentType: 'application/json; charset=utf-8',
    responseCode: 'google_not_configured',
    localApiTarget,
  };
  const errors = [
    {
      kind: 'console',
      message: chromiumDiagnostic,
      localApiTarget,
      detail: 'expected Chromium diagnostic',
    },
    {
      kind: 'console',
      message: chromiumDiagnostic,
      localApiTarget,
      detail: 'duplicate Chromium diagnostic',
    },
    {
      kind: 'console',
      message: chromiumDiagnostic,
      localApiTarget: null,
      detail: 'application console error',
    },
    {
      kind: 'page',
      message: chromiumDiagnostic,
      localApiTarget,
      detail: 'application page error',
    },
  ];

  assert.deepEqual(
    helpers.unexpectedBrowserErrors(errors, [expectedResponse]),
    [
      'duplicate Chromium diagnostic',
      'application console error',
      'application page error',
    ],
  );
  assert.deepEqual(
    helpers.unexpectedBrowserErrors([errors[0]], [{
      ...expectedResponse,
      responseCode: 'internal_error',
    }]),
    ['expected Chromium diagnostic'],
  );
});

test('Back Office login waits for the asynchronous PrestaShop login form to disappear', async () => {
  assert.equal(importFailure, null, 'smoke host-policy helpers must be importable');
  const events = [];
  let finishLogin;
  const emailInput = {
    first() { return this; },
    async isVisible() { return true; },
    async fill(value) { events.push(`email:${value}`); },
    waitFor(options) {
      events.push(`wait:${options.state}:${options.timeout}`);
      return new Promise((resolve) => { finishLogin = resolve; });
    },
  };
  const passwordInput = {
    first() { return this; },
    async isVisible() { return true; },
    async fill(value) { events.push(`password:${value}`); },
  };
  const submit = {
    first() { return this; },
    async isVisible() { return true; },
    async click() { events.push('submit'); },
  };
  const page = {
    locator(selector) {
      if (selector.includes('type="email"')) return emailInput;
      if (selector.includes('type="password"')) return passwordInput;
      return submit;
    },
    async waitForLoadState(state) { events.push(`load:${state}`); },
  };

  let completed = false;
  const login = helpers.loginIfNeeded(page, 'admin@example.test', 'test-password')
    .then(() => { completed = true; });
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(events, [
    'email:admin@example.test',
    'password:test-password',
    'submit',
    'wait:hidden:15000',
  ]);
  assert.equal(completed, false);

  finishLogin();
  await login;
  assert.equal(completed, true);
  assert.deepEqual(events, [
    'email:admin@example.test',
    'password:test-password',
    'submit',
    'wait:hidden:15000',
    'load:domcontentloaded',
  ]);
});
