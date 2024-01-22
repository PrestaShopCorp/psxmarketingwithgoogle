export const disapprovedProductsMock = {
  results: [
    {
      id: "7937",
      attribute: "0",
      currency: "EUR",
      name: "Bulbasaur",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "invalid_currency",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "price",
          destination: "Shopping",
          description: "Invalid currency [price]",
          detail: "Use a supported currency of the country of sale",
          documentation: "https://support.google.com/merchants/answer/160637",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "invalid_currency",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "price",
          destination: "SurfacesAcrossGoogle",
          description: "Invalid currency [price]",
          detail: "Use a supported currency of the country of sale",
          documentation: "https://support.google.com/merchants/answer/160637",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "Shopping",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "item_missing_required_attribute",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "price",
          destination: "Shopping",
          description: "Missing value [price]",
          detail: "Add this attribute to your product data",
          documentation: "https://support.google.com/merchants/answer/7052112",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "item_missing_required_attribute",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "price",
          destination: "SurfacesAcrossGoogle",
          description: "Missing value [price]",
          detail: "Add this attribute to your product data",
          documentation: "https://support.google.com/merchants/answer/7052112",
          applicableCountries: ["FR", "IT", "BE"],
        },
      ],
    },
    {
      id: "7945",
      attribute: "0",
      currency: "EUR",
      name: "Blastoise",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7942",
      attribute: "0",
      currency: "EUR",
      name: "Charizard",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "Shopping",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "8028",
      attribute: "0",
      currency: "EUR",
      name: "Gastly",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7946",
      attribute: "0",
      currency: "EUR",
      name: "Chenipan",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7948",
      attribute: "0",
      currency: "EUR",
      name: "Papilusion",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "Shopping",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "SurfacesAcrossGoogle",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7961",
      attribute: "4",
      currency: "EUR",
      name: "Pikachu",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "Shopping",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7990",
      attribute: "0",
      currency: "EUR",
      name: "Psykokwak",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "Shopping",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "SurfacesAcrossGoogle",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7961",
      attribute: "0",
      currency: "EUR",
      name: "Pikachu",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "Shopping",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7946",
      attribute: "0",
      currency: "EUR",
      name: "Caterpie",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "8087",
      attribute: "0",
      currency: "EUR",
      name: "Mew",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7948",
      attribute: "0",
      currency: "EUR",
      name: "Butterfree",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "Shopping",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "SurfacesAcrossGoogle",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7961",
      attribute: "0",
      currency: "EUR",
      name: "Pikachu",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7961",
      attribute: "3",
      currency: "EUR",
      name: "Pikachu",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "Shopping",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "8087",
      attribute: "0",
      currency: "EUR",
      name: "Mew",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "Shopping",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7961",
      attribute: "4",
      currency: "EUR",
      name: "Pikachu",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7945",
      attribute: "0",
      currency: "EUR",
      name: "Blastoise",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "Shopping",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "language_mismatch",
          servability: "unaffected",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description: "Incorrect language",
          detail: "Use a supported language for the country of sale",
          documentation: "https://support.google.com/merchants/answer/6101164",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7942",
      attribute: "0",
      currency: "EUR",
      name: "Charizard",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "8028",
      attribute: "0",
      currency: "EUR",
      name: "Fantominus",
      language: "fr",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7961",
      attribute: "3",
      currency: "EUR",
      name: "Pikachu",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["FR", "IT", "BE"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "live_animals_policy_violation",
          servability: "disapproved",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Local legal requirements and safety standards (live animals)",
          detail:
            "Promotions of live animals or services for the transportation of live animals (e.g. live fishing bait, selling of live animals as pets).",
          documentation:
            "https://support.google.com/merchants/answer/6150100#wycd-safety-standards-restrictions",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7990",
      attribute: "0",
      currency: "EUR",
      name: "Psyduck",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "Shopping",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "image_link_broken",
          servability: "unaffected",
          resolution: "merchant_action",
          attributeName: "additional image link",
          destination: "SurfacesAcrossGoogle",
          description: "Invalid image [additional image link]",
          detail:
            "Ensure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)",
          documentation: "https://support.google.com/merchants/answer/6098289",
          applicableCountries: ["FR", "IT", "BE"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
    {
      id: "7937",
      attribute: "0",
      currency: "EUR",
      name: "Bulbasaur",
      language: "en",
      statuses: [
        {
          destination: "Shopping",
          status: "disapproved",
          countries: ["IT"],
        },
        {
          destination: "SurfacesAcrossGoogle",
          status: "disapproved",
          countries: ["IT"],
        },
      ],
      issues: [
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "Shopping",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "hard_goods_missing_2_out_of_3_identifiers",
          servability: "demoted",
          resolution: "merchant_action",
          destination: "SurfacesAcrossGoogle",
          description:
            "Limited performance due to missing identifiers [gtin, mpn, brand]",
          detail:
            "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don't need to add an identifier.",
          documentation: "https://support.google.com/merchants/answer/6098295",
          applicableCountries: ["FR", "IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "Shopping",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
        {
          code: "missing_shipping_no_shipping_service_defined_for_country",
          servability: "disapproved",
          resolution: "merchant_action",
          attributeName: "shipping",
          destination: "SurfacesAcrossGoogle",
          description: "Missing shipping in some countries",
          detail:
            "Add shipping information for all countries you sell products in so customers know the delivery time and cost",
          documentation: "https://support.google.com/merchants/answer/6239383",
          applicableCountries: ["IT"],
        },
      ],
    },
  ],
};
