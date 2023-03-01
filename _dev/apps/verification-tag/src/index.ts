import {
  fetchOnboarding,
  initOnboardingClient,
} from "mktg-with-google-common/api/onboardingClient";
import {
  fetchShop,
  initShopClient,
} from "mktg-with-google-common/api/shopClient";
import * as Sentry from "@sentry/browser";
declare global {
  interface Window {
    psxMktgWithGoogleControllerLink: string;
    psxMktgWithGoogleTokenPsAccounts: string;
    psxMktgWithGoogleShopIdPsAccounts: string;
    psxMktgWithGoogleApiUrl: string;
    psxMktgWithGoogleDsnSentry: string;
    psxMktgWithGoogleOnProductionEnvironment: boolean;
  }
}

const runRetrievalOfVerificationTag = async (): Promise<void> => {
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
  
    console.log('Marketing with Google - Google Verification tag has been refreshed.');
  } catch (e) {
    console.error('Marketing with Google - Google Verification tag refresh failed.', e);
    Sentry.captureException(e);
  }
};

const init = (): void => {
  const appVersion = process.env.VUE_APP_BUILD_VERSION || 'dev';

  initShopClient({ shopUrl: window.psxMktgWithGoogleControllerLink });
  initOnboardingClient({
    apiUrl: window.psxMktgWithGoogleApiUrl,
    token: window.psxMktgWithGoogleTokenPsAccounts,
  });

  if (window.psxMktgWithGoogleOnProductionEnvironment) {
    Sentry.init({
      dsn: window.psxMktgWithGoogleDsnSentry,
      allowUrls: [
        'https://storage.googleapis.com/psxmarketing-cdn/',
      ],
      tracesSampleRate: 1.0,
      initialScope: {
        user: {
          id: window.psxMktgWithGoogleShopIdPsAccounts ? window.psxMktgWithGoogleShopIdPsAccounts.toString() : 'unknown',
        },
      },
      release: appVersion,
    });
  }
  
}

init();
runRetrievalOfVerificationTag();
