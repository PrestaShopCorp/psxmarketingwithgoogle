import {
  fetchOnboarding,
  initOnboardingClient,
} from "mktg-with-google-common/api/onboardingClient";
import {
  fetchShop,
  initShopClient,
} from "mktg-with-google-common/api/shopClient";
declare global {
  interface Window {
    psxMktgWithGoogleControllerLink: string;
    tokenPsAccounts: string;
    psxMktgWithGoogleApiUrl: string;
  }
}
// Add error handler ? Analytics ?

const runRetrievalOfVerificationTag = async (): Promise<void> => {
  const correlationId = `${Math.floor(Date.now() / 1000)}`;

  initShopClient({ shopUrl: window.psxMktgWithGoogleControllerLink });
  initOnboardingClient({
    apiUrl: window.psxMktgWithGoogleApiUrl,
    token: window.tokenPsAccounts,
  });
    
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

  console.log('Marketing with Google - Google Verification tag has been refreshed');
};

runRetrievalOfVerificationTag();
