import countriesSelectionOptions from '@/assets/json/countries.json';

type Country = {
  country: string;
  currency: string;
  shoppingOngletAvailable: boolean,
  onBeta: boolean,
  enterpriseNumberNeeded: boolean,
  shoppingFrAvailable: boolean,
  code: string;
};

export const changeCountryCodeToName = ((country: string) => {
  for (let i = 0; i < countriesSelectionOptions.length; i += 1) {
    if (country === countriesSelectionOptions[i].code) {
      return countriesSelectionOptions[i].country;
    }
  }

  return country;
});

export const changeCountriesCodesToNames = (countries : string[]) => countries.map(
  changeCountryCodeToName,
);

export const changeCountryNameToCode = ((country: string) => {
  for (let i = 0; i < countriesSelectionOptions.length; i += 1) {
    if (country === countriesSelectionOptions[i].country) {
      return countriesSelectionOptions[i].code;
    }
  }

  return country;
});

export const changeCountriesNamesToCodes = (countries: string[]) => countries.map(
  changeCountryNameToCode,
);

export const getCurrencyFromCountry = (countryCode: string): string|undefined => {
  return countriesSelectionOptions.find((someCountry: Country) => (
    someCountry.code === countryCode
  ))?.currency;
};
