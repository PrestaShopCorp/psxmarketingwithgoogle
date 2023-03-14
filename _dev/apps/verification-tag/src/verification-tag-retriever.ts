import * as Sentry from "@sentry/browser";
import {fetchOnboarding as fetchOnboardingType, fetchShop as fetchShopType, HttpClientError} from 'mktg-with-google-common';

const correlationId = `${Math.floor(Date.now() / 1000)}`;
const scope = new Sentry.Scope();

export const runRetrievalOfVerificationTag = async (
  fetchOnboarding: typeof fetchOnboardingType,
  fetchShop: typeof fetchShopType,
): Promise<void> => {
  try {
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
  } catch (e) {
    console.error('Marketing with Google - Google Verification tag refresh failed.', e);
    scope.setTag('correlationId', correlationId);
    Sentry.captureException(e, scope);
  }
};

const responseHandler = async (response: Response) => {
  if (!response.ok) {
    const error = new HttpClientError(response.statusText, response.status);

    try {
      const content = await response.text();
      scope.setExtra('responseContent', content);
    } catch {
      // Do nothing
    }

    scope.setTransactionName(response.url);
    throw error;
  }
};

