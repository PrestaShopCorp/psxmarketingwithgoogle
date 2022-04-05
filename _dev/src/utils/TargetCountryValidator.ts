import availableCountries from '../assets/json/countries.json';

export function filterCountriesCompatible(countries: string | string[]): string[] {
  if (typeof countries === 'string') {
    const country = availableCountries.find(
      (ctr) => ctr.code === countries,
    );

    if (country) {
      return [countries];
    }
    return [];
  }
  return countries.filter((country) => availableCountries.some((c) => c.code === country));
}

export default {filterCountriesCompatible};
