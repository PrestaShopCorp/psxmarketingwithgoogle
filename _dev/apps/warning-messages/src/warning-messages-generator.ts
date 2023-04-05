import de from "mktg-with-google-common/translations/de/warnings.json";
import en from "mktg-with-google-common/translations/en/warnings.json";
import es from "mktg-with-google-common/translations/es/warnings.json";
import fr from "mktg-with-google-common/translations/fr/warnings.json";
import it from "mktg-with-google-common/translations/it/warnings.json";
import nl from "mktg-with-google-common/translations/nl/warnings.json";
import pl from "mktg-with-google-common/translations/pl/warnings.json";
import pt from "mktg-with-google-common/translations/pt/warnings.json";
import ru from "mktg-with-google-common/translations/ru/warnings.json";
import {createI18n} from "vue-i18n";
import {fetchOnboarding} from "mktg-with-google-common";
import {WarningElement} from "./WarningElement";
import {aknowledgeWarning} from "./wanings-list-retriever";

export const messages = {
  de,
  en,
  es,
  fr,
  it,
  nl,
  pl,
  pt,
  ru,
};

const i18n = createI18n({
  messages,
  fallbackLocale: 'en',
});

export const buildWarningMessages = (messageKeys: string[], settings: {isoCode: string, link: string}) => {
  
  // @ts-ignore
  i18n.global.locale = settings.isoCode;
  const elements = messageKeys.map((messageKey) => 
    new WarningElement({
      message: i18n.global.t(`${messageKey}.message`, {
        link: `<a href="${settings.link}" target="_blank">`,
        endLink: '</a>',
      }).toString(),
      cta: {
        buttonContent: i18n.global.t(`${messageKey}.ctaContent`).toString(),
        link: settings.link,
      },
      onClose: () => {
        aknowledgeWarning(messageKey, fetchOnboarding);
        console.log(`Message ${messageKey} has been acknowledged.`);
      },
    }).build(),
  );


  return {
    elements,
    attachBefore: (target: Element): void => {
      target.before(...elements);
    },
  };
};