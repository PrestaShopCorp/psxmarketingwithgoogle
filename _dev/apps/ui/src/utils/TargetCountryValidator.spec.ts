/* eslint-disable */

/**
 * @vitest-environment jsdom
 */

import { filterCountriesCompatible } from './TargetCountryValidator';

describe("Testing if country is eligible with google", () => {
  it('should return the country sent', () => {
    const countryCode = 'FR';
    expect(filterCountriesCompatible(countryCode)).toStrictEqual(['FR']);
  });

  it('should return an empty array', () => {
    const countryCode = 'BGR';
    expect(filterCountriesCompatible(countryCode)).toStrictEqual([]);
  });

  it('should filter the array of countries with available country', () => {
    const countries = ['FR', 'BE', 'IT', 'BGR'];
    expect(filterCountriesCompatible(countries)).toStrictEqual(["FR", "BE", "IT"]);
  })
});
