import de from "mktg-with-google-common/translations/de/warnings.json";
import en from "mktg-with-google-common/translations/en/warnings.json";
import es from "mktg-with-google-common/translations/es/warnings.json";
import fr from "mktg-with-google-common/translations/fr/warnings.json";
import it from "mktg-with-google-common/translations/it/warnings.json";
import nl from "mktg-with-google-common/translations/nl/warnings.json";
import pl from "mktg-with-google-common/translations/pl/warnings.json";
import pt from "mktg-with-google-common/translations/pt/warnings.json";
import ru from "mktg-with-google-common/translations/ru/warnings.json";
import {WarningElement} from "./WarningElement";
import { I18n } from "i18n-js";

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

const i18n = new I18n(messages, {
  defaultLocale: 'en',
});

export const buildWarningMessages = (messageKeys: string[], settings: {isoCode: string, link: string}) => {
  
  i18n.locale = settings.isoCode;
  const elements = messageKeys.map((messageKey) => 
    new WarningElement({
      message: i18n.t(`${messageKey}.message`, {
        'link': `<a href="${settings.link}" target="_blank">`,
        '/link': '</a>',
      }),
      cta: {
        buttonContent: i18n.t(`${messageKey}.ctaContent`),
        link: settings.link,
      }
    }).build(),
  );


  return {
    attachBefore: (target: Element): void => {
      target.before(...elements);
    },
  };
};