import {fetchOnboarding, initOnboardingClient} from "mktg-with-google-common/api/onboardingClient";
import {buildWarningMessages} from "./warning-messages-generator";
import {getListOfWarnings} from "./wanings-list-retriever";


declare global {
  interface Window {
    psxMktgWithGoogleControllerLink: string;
    psxMktgWithGoogleAdminUrl: string;
    psxMktgWithGoogleApiUrl: string;
    psxMktgWithGoogleOnProductionEnvironment: boolean;
    i18nSettings: {
      isoCode: string;
      languageLocale: string;
    };
  }
}

initOnboardingClient({
  apiUrl: window.psxMktgWithGoogleApiUrl,
});

document.addEventListener('DOMContentLoaded', async () => {

  const messagesToDisplay = await getListOfWarnings(fetchOnboarding);

  buildWarningMessages(messagesToDisplay, {
    isoCode: (new Intl.Locale(window.i18nSettings.languageLocale)).language,
    link: window.psxMktgWithGoogleAdminUrl,
  }).attachBefore(document.getElementById('dashboard'));
});
