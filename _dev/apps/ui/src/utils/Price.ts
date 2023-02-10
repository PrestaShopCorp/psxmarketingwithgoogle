export const formatPrice = (value: number, currencyCode?: string): string => {
  if (!currencyCode?.length) {
    console.warn('No currency code provided when formating price');
    return value.toString();
  }

  return Intl.NumberFormat(window.i18nSettings.languageLocale, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
  }).format(value);
};

export default {};
