import { AnalyticsBrowser } from "@segment/analytics-next";
import * as Sentry from "@sentry/browser";
import {fetchOnboarding as fetchOnboardingType, fetchShop as fetchShopType, HttpClientError} from 'mktg-with-google-common';

const correlationId = `${Math.floor(Date.now() / 1000)}`;
const scope = new Sentry.Scope();

export const runRetrievalOfVerificationTag = async (
  fetchOnboarding: typeof fetchOnboardingType,
  fetchShop: typeof fetchShopType,
  analytics?: AnalyticsBrowser,
): Promise<void> => {
  try {
    analytics?.track('[GGL] Re-verification & claiming Started');

    // 1- Get site verification token from onboarding API
    const {token} = await (await fetchOnboarding(
      "GET",
      "shopping-websites/site-verification/token",
      {
        correlationId,
        onResponse: responseHandler,
      },
    )).json();

    // 2- Store token in shop
    await fetchShop("setWebsiteVerificationMeta", {
      websiteVerificationMeta: token,
    });

    // 3- Request verification to Google via onboarding API
    await fetchOnboarding(
      "POST",
      "shopping-websites/site-verification/verify",
      {
        correlationId,
        onResponse: responseHandler,
      },
    );

    // 4- Claim website without overwrite
    const overwriteParam = '?overwrite=false';
    await fetchOnboarding(
      'POST',
      `shopping-websites/site-verification/claim${overwriteParam}`,
      {
        correlationId,
        onResponse: responseHandler,
      },
    );

    console.info('Marketing with Google - Google Verification tag has been refreshed.');
    analytics?.track('[GGL] Re-verification & claiming Succeeded');
  } catch (e) {
    console.error('Marketing with Google - Google Verification tag refresh failed.', e);
    analytics?.track('[GGL] Re-verification & claiming Failed');
    scope.setTag('correlationId', correlationId);

    // Send error to Sentry if it's not a 403 or 404 Forbidden error
    if (e.code !== 403 && e.code !== 404) {
      Sentry.captureException(e, scope);
    }
  }
};

const responseHandler = async (response: Response) => {
  if (!response.ok) {
    const error = new HttpClientError('Verification tag refresh failed', response.status);

    try {
      const content = await response.text();
      scope.setExtra('responseContent', content);

      // Allow call to fails when the overwrite is requested by Google.
      if (response.url.includes('shopping-websites/site-verification/claim')
        && content.includes('"needOverwrite":true')
      ) {
        return response;
      }
    } catch {
      // Do nothing
    }

    scope.setTransactionName(response.url);
    throw error;
  }
  return response;
};
