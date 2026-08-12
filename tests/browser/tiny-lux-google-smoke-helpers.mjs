export const FORBIDDEN_SERVICE_HOST = /prestashop|psessentials|cloudsync|segment|sentry/i;
const CHROMIUM_412_DIAGNOSTIC = 'Failed to load resource: the server responded with a status of 412 (Precondition Failed)';

function normalizedHttpHost(url, label) {
  if (!(url instanceof URL) || !/^https?:$/.test(url.protocol)) {
    throw new TypeError(`${label} must use HTTP or HTTPS`);
  }
  return url.host.toLowerCase();
}

export function allowedShopHosts(adminUrl, storefrontUrl) {
  return new Set([
    normalizedHttpHost(adminUrl, 'Admin URL'),
    normalizedHttpHost(storefrontUrl, 'Storefront URL'),
  ]);
}

export function requestedHostIsForbidden(
  requestUrl,
  allowedHosts,
  forbiddenPattern = FORBIDDEN_SERVICE_HOST,
) {
  let parsed;
  try {
    parsed = new URL(requestUrl);
  } catch {
    return true;
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    return false;
  }

  const host = parsed.host.toLowerCase();
  return !allowedHosts.has(host) && forbiddenPattern.test(host);
}

export function moduleRequestIsForbidden(
  requestUrl,
  frameUrl,
  allowedHosts,
  {
    resourceType = '',
    preExistingExternalFrameHosts = new Set(),
    forbiddenPattern = FORBIDDEN_SERVICE_HOST,
  } = {},
) {
  if (!requestedHostIsForbidden(requestUrl, allowedHosts, forbiddenPattern)) {
    return false;
  }

  let frameIsUnattributed = !frameUrl;
  if (frameUrl) {
    try {
      const parsedFrame = new URL(frameUrl);
      frameIsUnattributed = parsedFrame.protocol === 'about:'
        && parsedFrame.pathname === 'blank';
    } catch {
      // Malformed frame URLs are not exceptions.
    }
  }

  try {
    const requestHost = new URL(requestUrl).host.toLowerCase();
    if ((resourceType === 'document' || frameIsUnattributed)
      && preExistingExternalFrameHosts.has(requestHost)) {
      return false;
    }
  } catch {
    return true;
  }

  if (!frameUrl) {
    return true;
  }

  return requestBelongsToModule(frameUrl, allowedHosts);
}

export function requestBelongsToModule(frameUrl, allowedHosts) {
  if (!frameUrl) {
    return true;
  }

  try {
    const frame = new URL(frameUrl);
    return /^https?:$/.test(frame.protocol)
      ? allowedHosts.has(frame.host.toLowerCase())
      : true;
  } catch {
    return true;
  }
}

export function requestOwnerUrl(frameUrl, serviceWorkerUrl) {
  let frameIsUnattributed = !frameUrl;
  if (frameUrl) {
    try {
      const frame = new URL(frameUrl);
      frameIsUnattributed = frame.protocol === 'about:' && frame.pathname === 'blank';
    } catch {
      return frameUrl;
    }
  }

  return frameIsUnattributed && serviceWorkerUrl ? serviceWorkerUrl : frameUrl;
}

export function pageErrorsBelongToModule(page, ignoredPages) {
  return !ignoredPages.has(page);
}

function isExpectedOAuthNotConfigured(response) {
  return response.internalMethod === 'GET'
    && response.internalPath === 'oauth/authorized-url'
    && response.status === 412
    && /application\/json/i.test(response.contentType)
    && response.responseCode === 'google_not_configured';
}

export function localApiResponseIsExpected(response) {
  if (!response || !/application\/json/i.test(response.contentType ?? '')) {
    return false;
  }

  return (response.status >= 200 && response.status < 300)
    || isExpectedOAuthNotConfigured(response);
}

export function localApiControllerTarget(requestUrl) {
  try {
    const parsed = new URL(requestUrl);
    if (!/^https?:$/.test(parsed.protocol)
      || parsed.searchParams.get('controller') !== 'AdminTinyLuxGoogleApi') {
      return null;
    }

    return `${parsed.origin}${parsed.pathname}?controller=AdminTinyLuxGoogleApi`;
  } catch {
    return null;
  }
}

export function unexpectedBrowserErrors(errors, localApiResponses) {
  const expectedDiagnostics = new Map();
  for (const response of localApiResponses) {
    if (!isExpectedOAuthNotConfigured(response) || !response.localApiTarget) {
      continue;
    }
    expectedDiagnostics.set(
      response.localApiTarget,
      (expectedDiagnostics.get(response.localApiTarget) ?? 0) + 1,
    );
  }

  const unexpected = [];
  for (const error of errors) {
    const remaining = expectedDiagnostics.get(error.localApiTarget) ?? 0;
    if (error.kind === 'console'
      && error.message === CHROMIUM_412_DIAGNOSTIC
      && remaining > 0) {
      expectedDiagnostics.set(error.localApiTarget, remaining - 1);
      continue;
    }
    unexpected.push(error.detail);
  }

  return unexpected;
}

async function locatorIsVisible(locator) {
  return locator.isVisible().catch(() => false);
}

export async function loginIfNeeded(page, email, password, beforeSubmit = () => {}) {
  const emailInput = page.locator('input[type="email"], #email').first();
  const passwordInput = page.locator('input[type="password"], #passwd').first();
  if (!(await locatorIsVisible(emailInput)) || !(await locatorIsVisible(passwordInput))) {
    return false;
  }

  await emailInput.fill(email);
  await passwordInput.fill(password);
  const submit = page.locator(
    'button[type="submit"], #submit_login, input[type="submit"]',
  ).first();
  if (!(await locatorIsVisible(submit))) {
    throw new Error('Back Office login submit control is missing');
  }
  beforeSubmit();
  await submit.click();
  await emailInput.waitFor({ state: 'hidden', timeout: 15000 });
  await page.waitForLoadState('domcontentloaded');

  return true;
}

function assertAdminNavigationResponse(response, phase) {
  if (null === response) {
    throw new Error(`Back Office ${phase} navigation returned no HTTP response`);
  }

  const status = response.status();
  if ([401, 403, 404].includes(status)) {
    throw new Error(`Back Office ${phase} navigation returned HTTP ${status}`);
  }
}

function isIntendedAdminModuleLanding(actualUrl, adminUrl) {
  try {
    const actual = new URL(actualUrl);

    return actual.origin === adminUrl.origin
      && actual.pathname === adminUrl.pathname
      && actual.searchParams.get('controller') === 'AdminPsxMktgWithGoogleModule';
  } catch {
    return false;
  }
}

export async function navigateToAdminModule(
  page,
  adminUrl,
  email,
  password,
  beforeModuleNavigation,
) {
  const initialResponse = await page.goto(adminUrl.href, { waitUntil: 'domcontentloaded' });
  assertAdminNavigationResponse(initialResponse, 'initial');

  const submitted = await loginIfNeeded(
    page,
    email,
    password,
    beforeModuleNavigation,
  );
  if (submitted && !isIntendedAdminModuleLanding(page.url(), adminUrl)) {
    beforeModuleNavigation();
    const postLoginResponse = await page.goto(adminUrl.href, { waitUntil: 'domcontentloaded' });
    assertAdminNavigationResponse(postLoginResponse, 'post-login');
  }

  return submitted;
}

export function assertAllowedShopUrl(actualUrl, allowedHosts, label) {
  const parsed = new URL(actualUrl);
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error(`${label} final URL must use HTTP or HTTPS`);
  }
  if (!allowedHosts.has(parsed.host.toLowerCase())) {
    throw new Error(`${label} left the expected shop hosts`);
  }
}
