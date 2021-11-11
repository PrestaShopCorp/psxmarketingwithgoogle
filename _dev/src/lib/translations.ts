import en from '@/assets/json/translations/en.json';
import es from '@/assets/json/translations/es.json';
import fr from '@/assets/json/translations/fr.json';
import it from '@/assets/json/translations/it.json';

export const messages = {
  en,
  es,
  fr,
  it,
};

export const locales = Object.keys(messages);

export default {
  locales,
  messages,
};
