import {CountryDetail} from '@/store/modules/app/state';
import availableCountries from '../assets/json/countries.json';
import {DeliveryDetail} from '../providers/shipping-settings-provider';

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

export function activeCountriesWhereShipppingExist(
  deliveryDetails: DeliveryDetail[],
  countries: CountryDetail[],
): string[] {
  const arrayOfCountries: string[] = [];

  deliveryDetails.forEach((carrier: DeliveryDetail) => {
    countries.forEach((country: CountryDetail) => {
      if (country.code === carrier.country) {
        arrayOfCountries.push(country.country);
      }
    });
  });

  return [...new Set(arrayOfCountries)];
}

export default {
  filterCountriesCompatible,
  activeCountriesWhereShipppingExist,
};
