/**
 * @jest-environment jsdom
 */

import { filterUncheckedSegments } from './ssc-filters';

describe('SSC filters', () => {
  it('returns an empty array when everything is unchecked', () => {
    const result = filterUncheckedSegments([]);

    expect(result).toEqual([]);
  });

  it('returns the same array when everything is checked', () => {
    
    const source = {
        name: "All filters",
        id: "allFilters",
        checked: true,
        indeterminate: false,
        children: [
          {
            name: "category1",
            id: "category1",
            children: [
              {
                name: "Animaux et articles pour animaux de compagnie",
                resourceName: "productBiddingCategoryConstants/FR~LEVEL1~1",
                level: "LEVEL1",
                status: "ACTIVE",
                id: "1",
                countryCode: "FR",
                languageCode: "fr",
                localizedName: "Animaux et articles pour animaux de compagnie",
                checked: true,
              },
              {
                name: "Arts et loisirs",
                resourceName: "productBiddingCategoryConstants/FR~LEVEL1~8",
                level: "LEVEL1",
                status: "ACTIVE",
                id: "8",
                countryCode: "FR",
                languageCode: "fr",
                localizedName: "Arts et loisirs",
                checked: true,
              },
              {
                name: "Entreprise et industrie",
                resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
                level: "LEVEL1",
                status: "ACTIVE",
                id: "111",
                countryCode: "FR",
                languageCode: "fr",
                localizedName: "Entreprise et industrie",
                checked: true,
              },
            ]
          }
        ]
      };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual(source);
  });
});
