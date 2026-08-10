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
