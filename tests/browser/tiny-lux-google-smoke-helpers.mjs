export const FORBIDDEN_SERVICE_HOST = /prestashop|psessentials|cloudsync|segment|sentry/i;

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

export function assertAllowedShopUrl(actualUrl, allowedHosts, label) {
  const parsed = new URL(actualUrl);
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error(`${label} final URL must use HTTP or HTTPS`);
  }
  if (!allowedHosts.has(parsed.host.toLowerCase())) {
    throw new Error(`${label} left the expected shop hosts`);
  }
}
