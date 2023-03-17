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
  deepUpdateDimensionVisibility,
  findDimensionInTree,
  deepUpdateDimensionVisibilityFromTree,
} from "./SSCFilters";

import {availableFilters} from '@/../.storybook/mock/campaigns';
import { Dimension } from "../store/modules/campaigns/state";

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
              checked: false,
            },
            {
              name: "Arts et loisirs",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~8",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "8",
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: true,
            },
            {
              name: "Arts et loisirs",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~8",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "8",
              checked: true,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Arts et loisirs",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~8",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "8",
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
              checked: false,
            },
            {
              name: "Entreprise et industrie",
              resourceName: "productBiddingCategoryConstants/FR~LEVEL1~111",
              level: "LEVEL1",
              status: "ACTIVE",
              id: "111",
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
          visible: true,
          children: [
            {
              name: "Animaux et articles pour animaux de compagnie",
              id: "1",
              checked: false,
              indeterminate: false,
              numberOfProductsAssociated : 1,
              visible: true,
              children: [
                {
                  name: "Animal vivant",
                  id: "1",
                  checked: false,
                  numberOfProductsAssociated : 1,
                  visible: true,
                },
              ],
            },
            {
              name: "Arts et loisirs",
              id: "8",
              checked: false,
              indeterminate: false,
              numberOfProductsAssociated : 1,
              visible: true,
              children: [
                {
                  name: "Peinture",
                  id: "1",
                  checked: false,
                  indeterminate: false,
                  numberOfProductsAssociated : 1,
                  visible: true,
                  children: [
                    {
                      name: "Huile",
                      id: "1",
                      checked: false,
                      numberOfProductsAssociated : 1,
                      visible: true,
                    },
                    {
                      name: "Gouache",
                      id: "2",
                      checked: false,
                      numberOfProductsAssociated : 1,
                      visible: true,
                    },
                  ],
                },
                {
                  name: "Dessin",
                  id: "2",
                  checked: false,
                  numberOfProductsAssociated : 1,
                  visible: true,
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

describe("SSC filters - deepUpdateDimensionVisibility()", () => {
  const source = {
    visible: true,
    children: [
      {
        visible: false,
        children: [
          {
            visible: false,
          },
        ],
      },
      {
        visible: true,
        children: [
          {
            visible: false,
          },
        ],
      },
      {
        visible: true,
        children: [
          {
            visible: true,
          },
        ],
      },
    ],
  };

  it("updates all filters with the given boolean true", () => {
    deepUpdateDimensionVisibility(source, true);
    expect(source).toEqual({
        visible: true,
        children: [
          {
            visible: true,
            children: [
              {
                visible: true,
              },
            ],
          },
          {
            visible: true,
            children: [
              {
                visible: true,
              },
            ],
          },
          {
            visible: true,
            children: [
              {
                visible: true,
              },
            ],
          },
        ],
      }
    );
  });

  it("updates all filters with the given boolean false", () => {
    deepUpdateDimensionVisibility(source, false);
    expect(source).toEqual({
        visible: false,
        children: [
          {
            visible: false,
            children: [
              {
                visible: false,
              },
            ],
          },
          {
            visible: false,
            children: [
              {
                visible: false,
              },
            ],
          },
          {
            visible: false,
            children: [
              {
                visible: false,
              },
            ],
          },
        ],
      }
    );
  });
});

describe("SSC filters - deepUpdateDimensionVisibilityFromTree()", () => {
  let tree: Dimension;
  beforeEach(() => {
    tree = JSON.parse(JSON.stringify(availableFilters[0]));
  });

  it("hides all filters missing in search results", () => {
    const searchResults = [{
      name: "categories",
      id: "categories",
      checked: false,
      indeterminate: true,
      children: [
        {
          "id": "5436832322",
          // [...]
          "children": [],
        },
        {
          id: "1",
          // [...]
          "children": [
            {
              id: "a",
              // [...]
              "children": [
                {
                  id:"abc",
                  // [...]
                }
              ],
            }
          ],
        },
        {
          id: "222",
          // [...]
        }
      ],
    }];
    deepUpdateDimensionVisibilityFromTree(tree, searchResults);
    expect(tree).toEqual({
      name: "categories",
      id: "categories",
      checked: false,
      indeterminate: true,
      visible: true,
      children: [
        {
          status: "ACTIVE",
          id: "1",
          name: "Animaux et articles pour animaux de compagnie",
          checked: false,
          indeterminate: true,
          visible: true,
          children: [
            {
              id:"a",
              name: "Chien",
              checked: true,
              indeterminate: false,
              numberOfProductsAssociated: 12,
              visible: true,
              children: [
                {
                  id:"ab",
                  countryCode: "FR",
                  languageCode: "fr",
                  name: "Labrador",
                  checked: true,
                  numberOfProductsAssociated: 10,
                  visible: false,
                },
                {
                  id:"abc",
                  countryCode: "FR",
                  languageCode: "fr",
                  name: "Berger Allemand",
                  checked: true,
                  numberOfProductsAssociated: 2,
                  visible: true,
                },
              ]
            },
            {
              status: "ACTIVE",
              id: "b",
              name: "Chat",
              checked: true,
              indeterminate: false,
              visible: false,
            },
          ],
        },
        {
          status: "ACTIVE",
          id: "8",
          name: "Arts et loisirs",
          checked: false,
          indeterminate: false,
          visible: false,
        },
        {
          status: "ACTIVE",
          id: "166",
          name: "Vêtements et accessoires",
          checked: true,
          indeterminate: false,
          numberOfProductsAssociated: 13,
          visible: false,
          children: [
            {
              status: "ACTIVE",
              id: "111",
              name: "Entreprise et industrie",
              checked: true,
              numberOfProductsAssociated: 12,
              visible: false,
            },
            {
              status: "ACTIVE",
              id: "141",
              name: "Appareils photo, caméras et instruments d'optique",
              checked: true,
              numberOfProductsAssociated: 1,
              visible: false,
            },
          ]
        },
        {
          status: "ACTIVE",
          id: "222",
          name: "Appareils électroniques",
          checked: false,
          indeterminate: false,
          visible: true,
        },
        {
          status: "ACTIVE",
          id: "412",
          name: "Alimentation, boissons et tabac",
          checked: false,
          indeterminate: false,
          visible: false,
        },
        {
          status: "ACTIVE",
          id: "436",
          name: "Meubles",
          checked: false,
          indeterminate: false,
          visible: false,
        },
      ],
    });
  });
});

describe("SSC filters - findDimensionInTree()", () => {
  const tree = availableFilters;

  it("finds in first level", () => {
    const dimension = {
      id: "8",
      name: "Arts et loisirs",
      // [...]
    };
    expect(findDimensionInTree(dimension, tree[0].children as Dimension[])).toBe(true);
  });

  it("finds in deep level", () => {
    const dimension = {
      id: "141",
      name: "Appareils photo, caméras et instruments d'optique",
      // [...]
    };
    expect(findDimensionInTree(dimension, tree)).toBe(true);
  });

  it("fails when it does not exist", () => {
    const dimension = {
      id: "🤷‍♂️",
      name: "One filter that does not exist in the search results",
      // [...]
    };
    expect(findDimensionInTree(dimension, tree)).toBe(false);
  })
});
