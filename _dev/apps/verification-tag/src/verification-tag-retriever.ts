import * as Sentry from "@sentry/browser";
import type {fetchOnboarding as fetchOnboardingType, fetchShop as fetchShopType} from 'mktg-with-google-common';

export const runRetrievalOfVerificationTag = async (
  fetchOnboarding: typeof fetchOnboardingType,
  fetchShop: typeof fetchShopType,
): Promise<void> => {
  const correlationId = `${Math.floor(Date.now() / 1000)}`;
    
  try {
    // 1- Get site verification token from onboarding API
    const {token} = await fetchOnboarding(
      "GET",
      "shopping-websites/site-verification/token",
      correlationId
    );
      
    // 2- Store token in shop
    await fetchShop("setWebsiteVerificationMeta", {
      websiteVerificationMeta: token,
    });

    // 3- Request verification to Google via onboarding API
    await fetchOnboarding(
      "POST",
      "shopping-websites/site-verification/verify",
      correlationId
    );
  
    console.info('Marketing with Google - Google Verification tag has been refreshed.');
  } catch (e) {
    console.error('Marketing with Google - Google Verification tag refresh failed.', e);
    Sentry.captureException(e);
  }
};

