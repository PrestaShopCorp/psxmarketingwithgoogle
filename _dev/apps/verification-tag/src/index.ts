import {
  fetchOnboarding,
  initOnboardingClient,
} from "mktg-with-google-common/api/onboardingClient";
import {
  fetchShop,
  initShopClient,
} from "mktg-with-google-common/api/shopClient";
import { runRetrievalOfVerificationTag } from "./verification-tag-retriever";
declare global {
  interface Window {
    psxMktgWithGoogleControllerLink: string;
    psxMktgWithGoogleApiUrl: string;
    psxMktgWithGoogleOnProductionEnvironment: boolean;
  }
}

const init = (): void => {
  initShopClient({ shopUrl: window.psxMktgWithGoogleControllerLink });
  initOnboardingClient({
    apiUrl: window.psxMktgWithGoogleApiUrl,
  });
}

init();
runRetrievalOfVerificationTag(fetchOnboarding, fetchShop);
