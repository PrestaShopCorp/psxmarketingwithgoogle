import availableCountries from '../assets/json/countries.json';

export function countryIsCompatibleWithGoogle(countryCode: string): string[] | [] {
  const country = availableCountries.find(
    (ctr) => ctr.code === countryCode,
  );
  if (country) {
    return [countryCode];
  }
  return [];
}

export default {countryIsCompatibleWithGoogle};
