/* eslint-disable */

/**
 * @jest-environment jsdom
 */

import {
  AttributeToMap,
  formatMappingToApi,
  filterMapping,
  AttributeResponseFromAPI,
  parseApiResponse,
  mergeAttributeMappings,
} from "./AttributeMapping";

import { productFeed } from "../../.storybook/mock/product-feed";

describe("AttributeMapping - checking if formatting is ok", () => {
  it("should return an array with description and gtin not empty and ids property", () => {
    const mapping: AttributeToMap[] = [
      {
        category: "commons",
        fields: [
          {
            label: "Description",
            name: "description",
            tooltip: true,
            recommended: [
              {
                name: ["description"],
                type: "product",
              },
            ],
            mapped: [
              {
                name: ["description"],
                type: "product",
              },
            ],
            required: true,
          },
          {
            label: "GTIN* (EAN, JAN, ISBN, UPC, ITF-14)",
            name: "gtin",
            tooltip: true,
            recommended: [],
            mapped: [
              {
                name: ["mpn"],
                type: "product",
              },
            ],
            required: false,
          },
          {
            label: "MPN (Manufacturer Part Number)",
            name: "mpn",
            tooltip: true,
            recommended: [
              {
                name: ["mpn"],
                type: "product",
              },
            ],
            mapped: [
              {
                name: ["mpn"],
                type: "product",
              },
            ],
            required: true,
          },
          {
            label: "Brand",
            name: "brand",
            tooltip: true,
            recommended: [
              {
                name: ["manufacturer"],
                type: "product",
              },
            ],
            mapped: [
              {
                name: ["manufacturer"],
                type: "product",
              },
            ],
            required: true,
          },
        ],
      },
      {
        category: "apparelAndAccessories",
        fields: [
          {
            label: "Age Group",
            name: "ageGroup",
            tooltip: true,
            recommended: [],
            mapped: [],
            required: true,
          },
          {
            label: "Color",
            name: "color",
            tooltip: true,
            recommended: [
              {
                name: ["color"],
                type: "custom",
              },
            ],
            mapped: [],
            required: true,
          },
          {
            label: "Gender",
            name: "gender",
            tooltip: true,
            recommended: [
              {
                name: ["gender"],
                type: "custom",
              },
            ],
            mapped: [],
            required: true,
          },
          {
            label: "Size",
            name: "size",
            tooltip: true,
            recommended: [
              {
                name: ["size"],
                type: "custom",
              },
            ],
            mapped: [
              {
                name: ["size"],
                type: "custom",
              },
            ],
            required: true,
          },
        ],
      },
    ];

    const expected = {
      color: [],
      gender: [],
      brand: [
        {
          ids: ["manufacturer"],
          type: "product",
        },
      ],
      size: [
        {
          ids: ["size"],
          type: "custom",
        },
      ],
      mpn: [
        {
          ids: ["mpn"],
          type: "product",
        },
      ],
      description: [
        {
          type: "product",
          ids: ["description"],
        },
      ],
      gtin: [
        {
          ids: ["mpn"],
          type: "product",
        },
      ],
      ageGroup: [],
    };

    const result = formatMappingToApi(mapping);

    expect(result).toEqual(expected);
  });

  it("AttributeMapping - should return an array with description and gtin not empty and id property", () => {
    const mapping: AttributeToMap[] = [
      {
        category: "commons",
        fields: [
          {
            label: "Description",
            name: "description",
            tooltip: true,
            recommended: [
              {
                name: "description",
                type: "product",
              },
            ],
            mapped: [
              {
                name: "description",
                type: "product",
              },
            ],
            required: true,
          },
          {
            label: "GTIN* (EAN, JAN, ISBN, UPC, ITF-14)",
            name: "gtin",
            tooltip: true,
            recommended: [],
            mapped: [
              {
                name: "mpn",
                type: "product",
              },
            ],
            required: false,
          },
          {
            label: "MPN (Manufacturer Part Number)",
            name: "mpn",
            tooltip: true,
            recommended: [
              {
                name: "mpn",
                type: "product",
              },
            ],
            mapped: [
              {
                name: "mpn",
                type: "product",
              },
            ],
            required: true,
          },
          {
            label: "Brand",
            name: "brand",
            tooltip: true,
            recommended: [
              {
                name: "manufacturer",
                type: "product",
              },
            ],
            mapped: [
              {
                name: "manufacturer",
                type: "product",
              },
            ],
            required: true,
          },
        ],
      },
      {
        category: "apparelAndAccessories",
        fields: [
          {
            label: "Age Group",
            name: "ageGroup",
            tooltip: true,
            recommended: [],
            mapped: [],
            required: true,
          },
          {
            label: "Color",
            name: "color",
            tooltip: true,
            recommended: [
              {
                name: "color",
                type: "custom",
              },
            ],
            mapped: [],
            required: true,
          },
          {
            label: "Gender",
            name: "gender",
            tooltip: true,
            recommended: [
              {
                name: "gender",
                type: "custom",
              },
            ],
            mapped: [],
            required: true,
          },
          {
            label: "Size",
            name: "size",
            tooltip: true,
            recommended: [
              {
                name: "size",
                type: "custom",
              },
            ],
            mapped: [
              {
                name: "size",
                type: "custom",
              },
            ],
            required: true,
          },
        ],
      },
    ];
    const expected = {
      color: [],
      gender: [],
      brand: [
        {
          id: "manufacturer",
          type: "product",
        },
      ],
      size: [
        {
          id: "size",
          type: "custom",
        },
      ],
      mpn: [
        {
          id: "mpn",
          type: "product",
        },
      ],
      description: [
        {
          type: "product",
          id: "description",
        },
      ],
      gtin: [
        {
          id: "mpn",
          type: "product",
        },
      ],
      ageGroup: [],
    };

    const result = formatMappingToApi(mapping);

    expect(result).toEqual(expected);
  });

  it("AttributeMapping - should filter each attribute which has elements that do not have ID", () => {
    const mapping: AttributeResponseFromAPI = {
      color: [],
      gender: [],
      brand: [
        {
          type: "product",
        },
        {
          id: "branding",
          type: "product",
        },
      ],
      size: [
        {
          type: "custom",
        },
      ],
      mpn: [
        {
          id: "mpn",
          type: "product",
        },
      ],
      description: [
        {
          type: "product",
          id: "description",
        },
      ],
      gtin: [
        {
          id: "mpn",
          type: "product",
        },
      ],
      ageGroup: [],
    };

    const expected = {
      color: [],
      gender: [],
      brand: [
        {
          id: "branding",
          type: "product",
        },
      ],
      size: [],
      mpn: [
        {
          id: "mpn",
          type: "product",
        },
      ],
      description: [
        {
          type: "product",
          id: "description",
        },
      ],
      gtin: [
        {
          id: "mpn",
          type: "product",
        },
      ],
      ageGroup: [],
    };

    const result = filterMapping(mapping);

    expect(result).toEqual(expected);
  });

  it("AttributeMapping - should mapped corretly with API response", () => {
    const apiResponse = {
      description: [
        {
          id: "description",
          type: "product",
        },
        {
          id: "gender",
          type: "custom",
        },
      ],
      gtin: [],
      brand: [
        {
          id: "manufacturer",
          type: "product",
        },
      ],
      mpn: [
        {
          id: "mpn",
          type: "product",
        },
      ],
    };

    const mapping = [
      {
        category: "commons",
        fields: [
          {
            label: "Description",
            name: "description",
            tooltip: true,
            recommended: [
              {
                name: ["description"],
                type: "product",
              },
              {
                name: ["gender"],
                type: "product",
              },
            ],
            mapped: [
              {
                name: ["description"],
                type: "product",
              },
            ],
            required: true,
          },
          {
            label: "GTIN* (EAN, JAN, ISBN, UPC, ITF-14)",
            name: "gtin",
            tooltip: true,
            recommended: [],
            mapped: null,
            required: false,
          },
          {
            label: "MPN (Manufacturer Part Number)",
            name: "mpn",
            tooltip: true,
            recommended: [
              {
                name: ["mpn"],
                type: "product",
              },
            ],
            mapped: null,
            required: true,
          },
          {
            label: "Brand",
            name: "brand",
            tooltip: true,
            recommended: [
              {
                name: ["manufacturer"],
                type: "product",
              },
            ],
            mapped: [
              {
                name: ["manufacturer"],
                type: "product",
              },
            ],
            required: true,
          },
        ],
      },
      {
        category: "apparelAndAccessories",
        fields: [
          {
            label: "Age Group",
            name: "ageGroup",
            tooltip: true,
            recommended: [],
            mapped: [],
            required: true,
          },
          {
            label: "Color",
            name: "color",
            tooltip: true,
            recommended: [
              {
                name: ["color"],
                type: "custom",
              },
            ],
            mapped: [],
            required: true,
          },
          {
            label: "Gender",
            name: "gender",
            tooltip: true,
            recommended: [
              {
                name: ["gender"],
                type: "custom",
              },
            ],
            mapped: [],
            required: true,
          },
          {
            label: "Size",
            name: "size",
            tooltip: true,
            recommended: [
              {
                name: ["size"],
                type: "custom",
              },
            ],
            mapped: null,
            required: true,
          },
        ],
      },
    ];

    const result = parseApiResponse(
      mapping,
      productFeed.attributesFromShop,
      apiResponse
    );

    expect(result).toEqual(mapping);
  });
});

describe("AttributeMapping", () => {
  const dataFromApi = [
    {
      category: "commons",
      fields: [
        {
          label: "Description",
          name: "description",
          tooltip: true,
          recommended: [{ name: ["description"], type: "product" }],
          mapped: [{ name: ["description"], type: "product" }],
          required: true,
        },
        {
          label: "GTIN* (EAN, JAN, ISBN, UPC, ITF-14)",
          name: "gtin",
          tooltip: true,
          recommended: [],
          mapped: [{ name: ["ean"], type: "product" }],
          required: false,
        },
        {
          label: "MPN (Manufacturer Part Number)",
          name: "mpn",
          tooltip: true,
          recommended: [{ name: ["mpn"], type: "product" }],
          mapped: [{ name: ["mpn"], type: "product" }],
          required: true,
        },
        {
          label: "Brand",
          name: "brand",
          tooltip: false,
          recommended: [{ name: ["manufacturer"], type: "product" }],
          mapped: [
          ],
          required: true,
        },
      ],
    },
    {
      category: "electronics",
      fields: [
        {
          label: "Energy class",
          name: "energyEfficiencyClass",
          tooltip: false,
          recommended: [],
          mapped: [],
          required: true,
        },
      ],
    },
  ];

  it("should merge payloads properly", () => {
    const dataFromLocalStorage = [
      {
        category: "commons",
        fields: [
          {
            label: "Brand",
            name: "brand",
            tooltip: false,
            recommended: [{ name: ["manufacturer"], type: "product" }],
            mapped: [
              { name: ["manufacturer"], type: "product" },
              { name: ["mpn"], type: "product" },
              { name: ["description"], type: "product" },
            ],
            required: true,
          },
        ],
      },
      {
        category: "variantSets",
        fields: [
          {
            label: "Material",
            name: "material",
            tooltip: false,
            recommended: [],
            mapped: [],
            required: true,
          },
        ],
      },
    ];

    const result = mergeAttributeMappings(dataFromApi, dataFromLocalStorage);
    expect(result).toStrictEqual([
      {
        category: "commons",
        fields: [
          {
            label: "Description",
            name: "description",
            tooltip: true,
            recommended: [{ name: ["description"], type: "product" }],
            mapped: [{ name: ["description"], type: "product" }],
            required: true,
          },
          {
            label: "GTIN* (EAN, JAN, ISBN, UPC, ITF-14)",
            name: "gtin",
            tooltip: true,
            recommended: [],
            mapped: [{ name: ["ean"], type: "product" }],
            required: false,
          },
          {
            label: "MPN (Manufacturer Part Number)",
            name: "mpn",
            tooltip: true,
            recommended: [{ name: ["mpn"], type: "product" }],
            mapped: [{ name: ["mpn"], type: "product" }],
            required: true,
          },
          {
            label: "Brand",
            name: "brand",
            tooltip: false,
            recommended: [{ name: ["manufacturer"], type: "product" }],
            mapped: [
              { name: ["manufacturer"], type: "product" },
              { name: ["mpn"], type: "product" },
              { name: ["description"], type: "product" },
            ],
            required: true,
          },
        ],
      },
      {
        category: "electronics",
        fields: [
          {
            label: "Energy class",
            name: "energyEfficiencyClass",
            tooltip: false,
            recommended: [],
            mapped: [],
            required: true,
          },
        ],
      },
    ]);
  });

  it("should handle empty another source", () => {
    const dataFromLocalStorage = null;

    const result = mergeAttributeMappings(dataFromApi, dataFromLocalStorage);
    expect(result).toStrictEqual(dataFromApi);
  });
});
