export const productValidationListMock = {
  filter: "disapproved",
  offset: 0,
  limit: 250,
  total: "110",
  results: [
    {
      id: "7937",
      title: "Bulbasaur",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
    {
      id: "7942",
      title: "Charizard",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
    {
      id: "7945",
      title: "Blastoise",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
    {
      id: "7946",
      title: "Caterpie",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
    {
      id: "7948",
      title: "Butterfree",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Missing shipping in some countries",
          destination: "Shopping",
          code: "missing_shipping_no_shipping_service_defined_for_country",
          affectedProperty: "shipping",
          countries: ["IT"],
          advice:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentationLink:
            "https://support.google.com/merchants/answer/6239383",
          status: "disapproved",
        },
      ],
    },
    {
      id: "7961",
      title: "Pikachu",
      impacts: [
        { attribute: "4", currency: "EUR", language: "en" },
        { attribute: "4", currency: "EUR", language: "fr" },
        { attribute: "4", currency: "GBP", language: "en" },
      ],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
    {
      id: "7990",
      title: "Psyduck",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
    {
      id: "8028",
      title: "Gastly",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
    {
      id: "8087",
      title: "Mew",
      impacts: [{ attribute: "0", currency: "EUR", language: "en" }],
      destinations: ["Shopping"],
      issues: [
        {
          title: "Invalid value [gtin]",
          destination: "Shopping",
          code: "invalid_upc",
          affectedProperty: "gtin",
          countries: ["FR", "BE"],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            "https://support.google.com/merchants/answer/6239388",
          status: "disapproved",
        },
      ],
    },
  ],
};

export default {
  productValidationListMock,
};
