import en from '@/assets/json/translations/en/ui.json';
import es from '@/assets/json/translations/es/ui.json';
import fr from '@/assets/json/translations/fr/ui.json';
import it from '@/assets/json/translations/it/ui.json';

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
