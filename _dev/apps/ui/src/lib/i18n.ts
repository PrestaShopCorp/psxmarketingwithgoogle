/**
 * 2007-2021 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from 'mktg-with-google-common/translations/en/ui.json';

Vue.use(VueI18n);

const translationFiles = {
  de: () => import('mktg-with-google-common/translations/de/ui.json'),
  en: () => import('mktg-with-google-common/translations/en/ui.json'),
  es: () => import('mktg-with-google-common/translations/es/ui.json'),
  fr: () => import('mktg-with-google-common/translations/fr/ui.json'),
  it: () => import('mktg-with-google-common/translations/it/ui.json'),
  nl: () => import('mktg-with-google-common/translations/nl/ui.json'),
  pl: () => import('mktg-with-google-common/translations/pl/ui.json'),
  pt: () => import('mktg-with-google-common/translations/pt/ui.json'),
  ru: () => import('mktg-with-google-common/translations/ru/ui.json'),
};

export const availableLocales = Object.keys(translationFiles);

const setI18nLanguage = (lang: string): string => {
  i18n.locale = lang;
  document?.querySelector('html')?.setAttribute('lang', lang);
  return lang;
};

export const loadLanguageAsync = async (lang: string): Promise<string> => {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language is not supported, fallback in English
  if (!translationFiles[lang]) {
    return Promise.resolve(setI18nLanguage('en'));
  }

  // Otherwise, proceed with the loading of the translation file
  return translationFiles[lang]().then((messages) => {
    i18n.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setI18nLanguage(lang);
  });
};

const {i18nSettings} = window;
const locale = i18nSettings?.languageLocale
  ? new Intl.Locale(i18nSettings.languageLocale).language
  : undefined;

const loadedLanguages = ['en'];

const i18n = new VueI18n({
  locale: 'en',
  messages: {en},
});

if (locale) {
  loadLanguageAsync(locale);
}

export default i18n;
