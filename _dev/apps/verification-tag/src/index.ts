import {
  fetchOnboarding,
  initOnboardingClient,
} from "mktg-with-google-common/api/onboardingClient";
import {
  fetchShop,
  initShopClient,
} from "mktg-with-google-common/api/shopClient";
import * as Sentry from "@sentry/browser";
import { runRetrievalOfVerificationTag } from "./verification-tag-retriever";
import { AnalyticsBrowser } from "@segment/analytics-next";
declare global {
  interface Window {
    psxMktgWithGoogleControllerLink: string;
    psxMktgWithGoogleTokenPsAccounts: string;
    psxMktgWithGoogleShopIdPsAccounts: string;
    psxMktgWithGoogleApiUrl: string;
    psxMktgWithGoogleDsnSentry: string;
    psxMktgWithGoogleOnProductionEnvironment: boolean;
    psxMktgWithGoogleSegmentId?: string;
  }
}

const init = (): void => {
  const appVersion = process.env.VITE_BUILD_VERSION || 'dev';

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
      sampleRate: 0.5,
      tracesSampleRate: 1,
      initialScope: {
        user: {
          id: window.psxMktgWithGoogleShopIdPsAccounts ? window.psxMktgWithGoogleShopIdPsAccounts.toString() : 'unknown',
        },
      },
      release: appVersion,
    });
  }
}
const initSegment = (): AnalyticsBrowser => {
  const analytics = AnalyticsBrowser.load(
    {writeKey: window.psxMktgWithGoogleSegmentId},
    {disableClientPersistence: true},
  );
  analytics.identify(window.psxMktgWithGoogleShopIdPsAccounts);
  return analytics;
}

init();
const analytics = initSegment();
runRetrievalOfVerificationTag(fetchOnboarding, fetchShop, analytics);
