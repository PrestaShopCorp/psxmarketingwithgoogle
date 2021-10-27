/* eslint-disable */


/**
 * @jest-environment jsdom
 */

import {filterUncheckedSegments, returnChildrenIds, checkForIndeterminate} from './SSCFilters';

describe('SSC filters - filterUncheckedSegments()', () => {
  it('returns an empty array when everything is unchecked', () => {
    const source = {
      name: 'All filters',
      id: 'allFilters',
      checked: false,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          children: [
            {
              name: 'Animaux et articles pour animaux de compagnie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '1',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Animaux et articles pour animaux de compagnie',
              checked: false,
            },
            {
              name: 'Arts et loisirs',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~8',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '8',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Arts et loisirs',
              checked: false,
            },
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: false,
            },
          ],
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({});
  });

  it('returns the same array when everything is checked', () => {
    const source = {
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          children: [
            {
              name: 'Animaux et articles pour animaux de compagnie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '1',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Animaux et articles pour animaux de compagnie',
              checked: true,
            },
            {
              name: 'Arts et loisirs',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~8',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '8',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Arts et loisirs',
              checked: true,
            },
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual(source);
  });

  it('leaves the original array untouched', () => {
    const source = {
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          checked: false,
          children: [
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: false,
            },
          ],
        },
        {
          name: 'category',
          id: 'category',
          children: [
            {
              name: 'Animaux et articles pour animaux de compagnie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '1',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Animaux et articles pour animaux de compagnie',
              checked: false,
            },
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
          checked: true,
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          checked: true,
          children: [
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
        },
      ],
    });
    expect(source).toEqual({
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          checked: false,
          children: [
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: false,
            },
          ],
        },
        {
          name: 'category',
          id: 'category',
          checked: true,
          children: [
            {
              name: 'Animaux et articles pour animaux de compagnie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '1',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Animaux et articles pour animaux de compagnie',
              checked: false,
            },
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
        },
      ],
    });
  });

  it('keeps the unchecked parent object if at least one child is checked', () => {
    const source = {
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          checked: false,
        },
        {
          name: 'category',
          id: 'category',
          children: [
            {
              name: 'Animaux et articles pour animaux de compagnie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '1',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Animaux et articles pour animaux de compagnie',
              checked: false,
            },
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
          checked: false,
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          checked: false,
          children: [
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
        },
      ],
    });
  });

  it('returns empty array when all children are unchecked', () => {
    const source = {
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          checked: true,
          children: [
            {
              name: 'Animaux et articles pour animaux de compagnie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '1',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Animaux et articles pour animaux de compagnie',
              checked: false,
            },
            {
              name: 'Arts et loisirs',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~8',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '8',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Arts et loisirs',
              checked: false,
            },
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: false,
            },
          ],
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({
      name: 'All filters',
      id: 'allFilters',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: 'category',
          checked: true,
          children: [],
        },
      ],
    });
  });
});

describe('SSC filters - returnChildrenIds()', () => {
  it('returns all children IDs', () => {
    const source = {
      name: 'All filters',
      id: '99',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: '991',
          children: [
            {
              name: 'Animaux et articles pour animaux de compagnie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '1',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Animaux et articles pour animaux de compagnie',
              checked: true,
            },
            {
              name: 'Arts et loisirs',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~8',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '8',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Arts et loisirs',
              checked: true,
            },
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '111',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
        },
        {
          name: 'category',
          id: '992',
          children: [
            {
              name: 'Entreprise et industrie',
              resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
              level: 'LEVEL1',
              status: 'ACTIVE',
              id: '11',
              countryCode: 'FR',
              languageCode: 'fr',
              localizedName: 'Entreprise et industrie',
              checked: true,
            },
          ],
        },
      ],
    };
    const result = returnChildrenIds(source);

    expect(result).toEqual([
      {
        dimension: 'category',
        values: [1, 8, 111],
      },
      {
        dimension: 'category',
        values: [11],
      },
    ],
    );
  });
});

describe('SSC filters - checkForIndeterminate()', () => {
  it('check indeterminate to false if children are all unchecked or checked', () => {
    const source = {
      name: 'All filters',
      id: '99',
      checked: true,
      indeterminate: true,
      children: [
        {
          name: 'category',
          id: '991',
          checked: true,
        },
        {
          name: 'category',
          id: '992',
          checked: true,
        },
      ],
    };
    const result = checkForIndeterminate(source);
    expect(result).toEqual({
      name: 'All filters',
      id: '99',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: '991',
          checked: true,
        },
        {
          name: 'category',
          id: '992',
          checked: true,
        },
      ],
    });
  });

  it('check indeterminate to true if children have not same checked status', () => {
    const source = {
      name: 'All filters',
      id: '99',
      checked: true,
      indeterminate: false,
      children: [
        {
          name: 'category',
          id: '991',
          checked: true,
        },
        {
          name: 'category',
          id: '992',
          checked: false,
        },
      ],
    };
    const result = checkForIndeterminate(source);
    expect(result).toEqual({
      name: 'All filters',
      id: '99',
      checked: true,
      indeterminate: true,
      children: [
        {
          name: 'category',
          id: '991',
          checked: true,
        },
        {
          name: 'category',
          id: '992',
          checked: false,
        },
      ],
    });
  });

  // it('check child and parent indeterminate to true if children have not same checked status', () => {
  //   const source = {
  //     name: 'All filters',
  //     id: '99',
  //     checked: true,
  //     indeterminate: false,
  //     children: [
  //       {
  //         name: 'category',
  //         id: '991',
  //         checked: true,
  //         indeterminate: false,
  //         children: [
  //           {
  //             name: 'Animaux et articles pour animaux de compagnie',
  //             resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
  //             level: 'LEVEL1',
  //             status: 'ACTIVE',
  //             id: '1',
  //             countryCode: 'FR',
  //             languageCode: 'fr',
  //             localizedName: 'Animaux et articles pour animaux de compagnie',
  //             checked: false,
  //           },
  //           {
  //             name: 'Entreprise et industrie',
  //             resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
  //             level: 'LEVEL1',
  //             status: 'ACTIVE',
  //             id: '111',
  //             countryCode: 'FR',
  //             languageCode: 'fr',
  //             localizedName: 'Entreprise et industrie',
  //             checked: true,
  //           },
  //         ],
  //       },
  //       {
  //         name: 'category',
  //         id: '992',
  //         checked: true,
  //       },
  //     ],
  //   };
  //   const result = checkForIndeterminate(source);
  //   expect(result).toEqual({
  //     name: 'All filters',
  //     id: '99',
  //     checked: true,
  //     indeterminate: true,
  //     children: [
  //       {
  //         name: 'category',
  //         id: '991',
  //         checked: true,
  //         indeterminate: true,
  //         children: [
  //           {
  //             name: 'Animaux et articles pour animaux de compagnie',
  //             resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~1',
  //             level: 'LEVEL1',
  //             status: 'ACTIVE',
  //             id: '1',
  //             countryCode: 'FR',
  //             languageCode: 'fr',
  //             localizedName: 'Animaux et articles pour animaux de compagnie',
  //             checked: false,
  //           },
  //           {
  //             name: 'Entreprise et industrie',
  //             resourceName: 'productBiddingCategoryConstants/FR~LEVEL1~111',
  //             level: 'LEVEL1',
  //             status: 'ACTIVE',
  //             id: '111',
  //             countryCode: 'FR',
  //             languageCode: 'fr',
  //             localizedName: 'Entreprise et industrie',
  //             checked: true,
  //           },
  //         ],
  //       },
  //       {
  //         name: 'category',
  //         id: '992',
  //         checked: true,
  //       },
  //     ],
  //   });
  // });
});
