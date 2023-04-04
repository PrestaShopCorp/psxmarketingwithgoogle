import * as Sentry from "@sentry/browser";
import {initOnboardingClient} from "mktg-with-google-common/api/onboardingClient";
import {buildWarningMessages} from "./warning-messages-generator";


declare global {
  interface Window {
    psxMktgWithGoogleControllerLink: string;
    psxMktgWithGoogleAdminUrl: string;
    psxMktgWithGoogleTokenPsAccounts: string;
    psxMktgWithGoogleShopIdPsAccounts: string;
    psxMktgWithGoogleApiUrl: string;
    psxMktgWithGoogleDsnSentry: string;
    psxMktgWithGoogleOnProductionEnvironment: boolean;
    i18nSettings: {
      isoCode: string;
    };
  }
}

const appVersion = process.env.VUE_APP_BUILD_VERSION || "dev";

initOnboardingClient({
  apiUrl: window.psxMktgWithGoogleApiUrl,
  token: window.psxMktgWithGoogleTokenPsAccounts,
});

if (window.psxMktgWithGoogleOnProductionEnvironment) {
  Sentry.init({
    dsn: window.psxMktgWithGoogleDsnSentry,
    allowUrls: ["https://storage.googleapis.com/psxmarketing-cdn/"],
    sampleRate: 0.5,
    tracesSampleRate: 1,
    initialScope: {
      user: {
        id: window.psxMktgWithGoogleShopIdPsAccounts
          ? window.psxMktgWithGoogleShopIdPsAccounts.toString()
          : "unknown",
      },
    },
    release: appVersion,
  });
}

document.addEventListener('DOMContentLoaded', function () {

  // ToDo: Plug with API
  const messagesToDisplay = ['NOT_ONBOARDED', 'NOT_COMPLETED'];

  buildWarningMessages(messagesToDisplay, {
    isoCode: window.i18nSettings.isoCode,
    link: window.psxMktgWithGoogleAdminUrl,
  }).attachBefore(document.getElementById('dashboard'));
});