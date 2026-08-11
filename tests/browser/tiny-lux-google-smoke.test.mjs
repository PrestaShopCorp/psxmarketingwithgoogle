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
