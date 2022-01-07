/* eslint-disable */

/**
 * @jest-environment jsdom
 */

import {
  filterUncheckedSegments,
  returnChildrenIds,
  checkAndUpdateDimensionStatus,
  addPropertiesToDimension,
  getFilters,
  returnCountProducts,
} from "./SSCFilters";

describe("SSC filters - filterUncheckedSegments()", () => {
  it("returns an empty array when everything is unchecked", () => {
    const source = {
      name: "All filters",
      id: "allFilters",
      checked: false,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
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
              checked: false,
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
              checked: false,
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
              checked: false,
            },
          ],
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({});
  });

  it("returns the same array when everything is checked", () => {
    const source = {
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
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
          ],
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual(source);
  });

  it("leaves the original array untouched", () => {
    const source = {
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
          checked: false,
          children: [
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
              countryCode: "FR",
              languageCode: "fr",
              localizedName: "Entreprise et industrie",
              checked: false,
            },
          ],
        },
        {
          name: "category",
          id: "category",
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
              checked: false,
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
          ],
          checked: true,
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
          checked: true,
          children: [
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
          ],
        },
      ],
    });
    expect(source).toEqual({
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
          checked: false,
          children: [
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
              countryCode: "FR",
              languageCode: "fr",
              localizedName: "Entreprise et industrie",
              checked: false,
            },
          ],
        },
        {
          name: "category",
          id: "category",
          checked: true,
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
              checked: false,
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
          ],
        },
      ],
    });
  });

  it("keeps the unchecked parent object if at least one child is checked", () => {
    const source = {
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
          checked: false,
        },
        {
          name: "category",
          id: "category",
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
              checked: false,
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
          ],
          checked: false,
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
          checked: false,
          children: [
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
          ],
        },
      ],
    });
  });

  it("returns empty array when all children are unchecked", () => {
    const source = {
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
          checked: true,
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
              checked: false,
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
              checked: false,
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
              checked: false,
            },
          ],
        },
      ],
    };
    const result = filterUncheckedSegments(source);

    expect(result).toEqual({
      name: "All filters",
      id: "allFilters",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
          checked: true,
          children: [],
        },
      ],
    });
  });
});

describe("SSC filters - returnChildrenIds()", () => {
  it("returns all children IDs", () => {

  let source = {
      name: "category",
      id: "category",
      checked: false,
      indeterminate: true,
      children: [
        {
          name: "Animaux et articles pour animaux de compagnie",
          id: "1",
          checked: false,
          indeterminate: true,
          numberOfProductsAssociated : 1,
          children: [
            {
              name: "Animal vivant",
              id: "1",
              checked: true,
              numberOfProductsAssociated : 1,
            },
          ],
        },
        {
          name: "Arts et loisirs",
          id: "8",
          checked: false,
          indeterminate: true,
          numberOfProductsAssociated : 1,
          children: [
            {
              name: "Peinture",
              id: "1",
              checked: true,
              indeterminate: false,
              numberOfProductsAssociated : 1,
              children: [
                {
                  name: "Gouache",
                  id: "22",
                  checked: true,
                  numberOfProductsAssociated : 1,
                },
              ],
            },
            {
              name: "Dessin",
              id: "2",
              checked: true,
              numberOfProductsAssociated : 1,
            },
          ],
        },
      ],
    };

    const result = returnChildrenIds(source);
    
    expect(result).toEqual(["1", "22", "2"])

});
});
    

describe("SSC filters - checkAndUpdateDimensionStatus()", () => {
  it("check indeterminate to false if children are all unchecked or checked", () => {
    const source = {
      name: "All filters",
      id: "99",
      checked: true,
      indeterminate: true,
      children: [
        {
          name: "category",
          id: "991",
          checked: true,
        },
        {
          name: "category",
          id: "992",
          checked: true,
        },
      ],
    };
    const result = checkAndUpdateDimensionStatus(source);
    expect(result).toEqual({
      name: "All filters",
      id: "99",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "991",
          checked: true,
        },
        {
          name: "category",
          id: "992",
          checked: true,
        },
      ],
    });
  });

  it("check indeterminate to true if children have not same checked status", () => {
    const source = {
      name: "All filters",
      id: "99",
      checked: false,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "991",
          checked: true,
        },
        {
          name: "category",
          id: "992",
          checked: false,
        },
      ],
    };
    const result = checkAndUpdateDimensionStatus(source);
    expect(result).toEqual({
      name: "All filters",
      id: "99",
      checked: false,
      indeterminate: true,
      children: [
        {
          name: "category",
          id: "991",
          checked: true,
        },
        {
          name: "category",
          id: "992",
          checked: false,
        },
      ],
    });
  });

  it("check child and parent indeterminate to true if children have not same checked status", () => {
    const source = {
      name: "All filters",
      id: "99",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "991",
          checked: true,
          indeterminate: false,
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
              checked: false,
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
          ],
        },
        {
          name: "category",
          id: "992",
          checked: false,
        },
      ],
    };
    const result = checkAndUpdateDimensionStatus(source);
    expect(result).toEqual({
      name: "All filters",
      id: "99",
      checked: false,
      indeterminate: true,
      children: [
        {
          name: "category",
          id: "991",
          checked: false,
          indeterminate: true,
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
              checked: false,
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
          ],
        },
        {
          name: "category",
          id: "992",
          checked: false,
        },
      ],
    });
  });

  it("sets a parent as indetermined if all children are indetermined too", () => {
    const source = {
      name: "All filters",
      id: "99",
      checked: true,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "991",
          checked: true,
          indeterminate: false,
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
              checked: false,
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
          ],
        },
        {
          name: "category",
          id: "992",
          checked: false,
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
              checked: false,
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
          ],
        },
      ],
    };
    const result = checkAndUpdateDimensionStatus(source);
    expect(result).toEqual({
      name: "All filters",
      id: "99",
      checked: false,
      indeterminate: true,
      children: [
        {
          name: "category",
          id: "991",
          checked: false,
          indeterminate: true,
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
              checked: false,
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
          ],
        },
        {
          name: "category",
          id: "992",
          checked: false,
          indeterminate: true,
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
              checked: false,
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
          ],
        },
      ],
    });
  });
});

describe("SSC filters - addPropertiesToDimension()", () => {
  it("returns all children with keys checked and indeterminate", () => {
    const source = {
      name: "All filters",
      id: "allFilters",
      checked: false,
      indeterminate: false,
      children: [
        {
          name: "category",
          id: "category",
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
              numberOfProductsAssociated : 1,
              children: [
                {
                  name: "Animal vivant",
                  id: "1",
                  numberOfProductsAssociated : 1,
                },
              ],
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
              numberOfProductsAssociated : 1,
              children: [
                {
                  name: "Peinture",
                  id: "1",
                  numberOfProductsAssociated : 1,
                  children: [
                    {
                      name: "Huile",
                      id: "1",
                      numberOfProductsAssociated : 1,
                    },
                    {
                      name: "Gouache",
                      id: "2",
                      numberOfProductsAssociated : 1,
                    },
                  ],
                },
                {
                  name: "Dessin",
                  id: "2",
                  numberOfProductsAssociated : 1,
                },
              ],
            },
          ],
        },
      ],
    };
    const result = addPropertiesToDimension(source.children);

    expect(result).toEqual([
        {
          name: "category",
          id: "category",
          checked: false,
          indeterminate: false,
          children: [
            {
              name: "Animaux et articles pour animaux de compagnie",
              id: "1",
              checked: false,
              indeterminate: false,
              numberOfProductsAssociated : 1,
              children: [
                {
                  name: "Animal vivant",
                  id: "1",
                  checked: false,
                  numberOfProductsAssociated : 1,
                },
              ],
            },
            {
              name: "Arts et loisirs",
              id: "8",
              checked: false,
              indeterminate: false,
              numberOfProductsAssociated : 1,
              children: [
                {
                  name: "Peinture",
                  id: "1",
                  checked: false,
                  indeterminate: false,
                  numberOfProductsAssociated : 1,
                  children: [
                    {
                      name: "Huile",
                      id: "1",
                      checked: false,
                      numberOfProductsAssociated : 1,
                    },
                    {
                      name: "Gouache",
                      id: "2",
                      checked: false,
                      numberOfProductsAssociated : 1,
                    },
                  ],
                },
                {
                  name: "Dessin",
                  id: "2",
                  checked: false,
                  numberOfProductsAssociated : 1,
                },
              ],
            },
          ],
        },
      ]);
  });
});
describe("SSC filters - getFilters()", () => {
  it("returns the count of last filter, the one with no children", () => {
    const source =  {
          name: "Animaux et articles pour animaux de compagnie",
          id: "1",
          numberOfProductsAssociated: 2,
          checked: false,
          children: [
              {
                  name: "Articles pour animaux de compagnie",
                  id: "2",
                  numberOfProductsAssociated: 1,
                  checked: true,
                  children: [
                      {
                          name: "Accessoires pour chiens",
                          id: "5",
                          numberOfProductsAssociated: 1,
                          checked: true,
                          children: [
                              {
                                  name: "Nourriture pour chiens",
                                  id: "3530",
                                  numberOfProductsAssociated: 1,
                                  checked: true,
                                  children: [
                                      {
                                          name: "Aliments pour chiens sans ordonnance",
                                          id: "543682",
                                          numberOfProductsAssociated: 1,
                                          checked: true,
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
                },
              {
                  name: "Test",
                  id: "3",
                  numberOfProductsAssociated: 321,
                  checked: false,
                  children: [
                      {
                          name: "test1",
                          id: "5",
                          numberOfProductsAssociated: 1,
                          checked: false,
                          children: [
                              {
                                  name: "Test1 enfant",
                                  id: "3530",
                                  numberOfProductsAssociated: 1,
                                  checked: false,
                                  children: [
                                      {
                                          name: "test1 enfant",
                                          id: "543682",
                                          numberOfProductsAssociated: 1,
                                          checked: false,
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          name: "test2",
                          id: "5",
                          numberOfProductsAssociated: 1,
                          checked: false,
                          children: [
                              {
                                  name: "Test2 enfant",
                                  id: "3530",
                                  numberOfProductsAssociated: 1,
                                  checked: false,
                                  children: [
                                      {
                                          name: "test2 enfant enfant2",
                                          id: "5436832322",
                                          numberOfProductsAssociated: 1,
                                          checked: false,
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              },
          ]
      };
    const result = getFilters(source, []);
    expect(result).toEqual([{
      name: "Aliments pour chiens sans ordonnance",
      id: "543682",
      numberOfProductsAssociated: 1,
      checked: true,
  }]);
});
});

describe("SSC filters - returnCountProducts()", () => {
  it("returns the count of prodicts of last filter, the one with no children", () => {
    const source =  {
          name: "Animaux et articles pour animaux de compagnie",
          id: "1",
          numberOfProductsAssociated: 2,
          checked: false,
          indeterminate: true,
          children: [
              {
                  name: "Articles pour animaux de compagnie",
                  id: "2",
                  numberOfProductsAssociated: 1,
                  checked: true,
                  indeterminate: false,
                  children: [
                      {
                          name: "Accessoires pour chiens",
                          id: "5",
                          numberOfProductsAssociated: 1,
                          checked: true,
                          indeterminate: false,
                          children: [
                              {
                                  name: "Nourriture pour chiens",
                                  id: "3530",
                                  numberOfProductsAssociated: 1,
                                  checked: true,
                                  indeterminate: false,
                                  children: [
                                      {
                                          name: "Aliments pour chiens sans ordonnance",
                                          id: "543682",
                                          numberOfProductsAssociated: 11,
                                          checked: true,
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
                },
              {
                  name: "Test",
                  id: "3",
                  numberOfProductsAssociated: 321,
                  checked: false,
                  indeterminate: true,
                  children: [
                      {
                          name: "test1",
                          id: "5",
                          numberOfProductsAssociated: 1,
                          checked: false,
                          indeterminate: false,
                          children: [
                              {
                                  name: "Test1 enfant",
                                  id: "3530",
                                  numberOfProductsAssociated: 1,
                                  checked: false,
                                  indeterminate: false,
                                  children: [
                                      {
                                          name: "test1 enfant",
                                          id: "543682",
                                          numberOfProductsAssociated: 1,
                                          checked: false,
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          name: "test2",
                          id: "5",
                          numberOfProductsAssociated: 1,
                          checked: true,
                          indeterminate: false,
                          children: [
                              {
                                  name: "Test2 enfant",
                                  id: "3530",
                                  numberOfProductsAssociated: 1,
                                  checked: true,
                                  indeterminate: false,
                                  children: [
                                      {
                                          name: "test2 enfant enfant2",
                                          id: "5436832322",
                                          numberOfProductsAssociated: 10,
                                          checked: true,
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              },
          ]
      };
    const result = returnCountProducts(source);
    expect(result).toEqual(21);
});
});
