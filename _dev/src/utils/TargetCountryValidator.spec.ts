/* eslint-disable */

/**
 * @jest-environment jsdom
 */

import {
  filterCountriesCompatible,
  activeCountriesWhereShipppingExist,
} from './TargetCountryValidator';

import {productFeed, productFeedConfiguredWithShippingUs} from '../../.storybook/mock/product-feed';

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

describe('Filtering country with shipping configured', () => {
  it('should return only country with shipping configured', () => {
    const availableCountries = [
      {
          "country": "Austria",
          "code": "AT"
      },
      {
          "country": "Belgium",
          "code": "BE"
      },
      {
          "country": "Finland",
          "code": "FI"
      },
      {
          "country": "France",
          "code": "FR"
      },
      {
          "country": "Germany",
          "code": "DE"
      },
      {
          "country": "Greece",
          "code": "GR"
      },
      {
          "country": "Ireland",
          "code": "IE"
      },
      {
          "country": "Italy",
          "code": "IT"
      },
      {
          "country": "Netherlands",
          "code": "NL"
      },
      {
          "country": "Portugal",
          "code": "PT"
      },
      {
          "country": "Slovakia",
          "code": "SK"
      },
      {
          "country": "Spain",
          "code": "ES"
      }
    ];
    const expectedCountry = ['France', 'Italy'];

    expect(
      activeCountriesWhereShipppingExist(
        productFeed.settings.deliveryDetails,
        availableCountries
      )
    ).toStrictEqual(expectedCountry);
  });
  it('should return no country', () => {
    const availableCountries = [
      {
          "country": "Austria",
          "code": "AT"
      },
      {
          "country": "Belgium",
          "code": "BE"
      },
      {
          "country": "Finland",
          "code": "FI"
      },
      {
          "country": "France",
          "code": "FR"
      },
      {
          "country": "Germany",
          "code": "DE"
      },
      {
          "country": "Greece",
          "code": "GR"
      },
      {
          "country": "Ireland",
          "code": "IE"
      },
      {
          "country": "Italy",
          "code": "IT"
      },
      {
          "country": "Netherlands",
          "code": "NL"
      },
      {
          "country": "Portugal",
          "code": "PT"
      },
      {
          "country": "Slovakia",
          "code": "SK"
      },
      {
          "country": "Spain",
          "code": "ES"
      }
    ];

    expect(
      activeCountriesWhereShipppingExist(
        productFeedConfiguredWithShippingUs.settings.deliveryDetails,
        availableCountries
      )
    ).toStrictEqual([]);
  })
})
