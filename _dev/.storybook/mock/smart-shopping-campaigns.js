export const sscDefault = {
campaigns: [],
  tracking: null,
  tagAlreadyExists: false
};


export const sscTrackingIsTrue = {
  ...sscDefault,
  tracking: true,
};


export const sscTrackingIsFalse = {
  ...sscDefault,
  tracking: false,
};


export const sscTagAlreadyExists = {
  ...sscDefault,
  tracking: true,
  tagAlreadyExists: true,
};

export const availableFilters = [{
      name: "smartShoppingCampaignCreation.categories",
      id: "categories",
      checked: false,
      indeterminate: true,
      children: [
        {
          status: "ACTIVE",
          id: "1",
          name: "Animaux et articles pour animaux de compagnie",
          checked: false,
          indeterminate: true,
          children: [
            {
              id:"a",
              name: "Chien",
              checked: true,
              indeterminate: false,
              numberOfProductsAssociated: 12,
              children: [
                {
                  id:"ab",
                  countryCode: "FR",
                  languageCode: "fr",
                  name: "Labrador",
                  checked: true,
                  numberOfProductsAssociated: 10,
                },
                {
                  id:"abc",
                  countryCode: "FR",
                  languageCode: "fr",
                  name: "Berger Allemand",
                  checked: true,
                  numberOfProductsAssociated: 2,
                },
              ]
            },
            {


              status: "ACTIVE",
              id: "b",
              name: "Chat",
              checked: true,
              indeterminate: false,
            },
          ],
        },
        {
          status: "ACTIVE",
          id: "8",
          name: "Arts et loisirs",
          checked: false,
          indeterminate: false,
        },
        {
          status: "ACTIVE",
          id: "166",
          name: "Vêtements et accessoires",
          checked: true,
          indeterminate: false,
          numberOfProductsAssociated: 13,
          children: [
            {
              status: "ACTIVE",
              id: "111",
              name: "Entreprise et industrie",
              checked: true,
              numberOfProductsAssociated: 12,
            },
            {
              status: "ACTIVE",
              id: "141",
              name: "Appareils photo, caméras et instruments d'optique",
              checked: true,
              numberOfProductsAssociated: 1,
            },
          ]
        },
        {
          status: "ACTIVE",
          id: "222",
          name: "Appareils électroniques",
          checked: false,
          indeterminate: false,
        },
        {
          status: "ACTIVE",
          id: "412",
          name: "Alimentation, boissons et tabac",
          checked: false,
          indeterminate: false,
        },
        {
          status: "ACTIVE",
          id: "436",
          name: "Meubles",
          checked: false,
          indeterminate: false,
        },
  ],
},
{
  name: "smartShoppingCampaignCreation.brand",
  id: "brand",
  checked: false,
  indeterminate: true,
  children: [
    {
      status: "ACTIVE",
      id: "1",
      countryCode: "FR",
      languageCode: "fr",
      name: "Animaux et articles pour animaux de compagnie",
      checked: false,
      indeterminate: true,
      children: [
        {
          id:"a",
          name: "Chien",
          checked: true,
          indeterminate: false,
          numberOfProductsAssociated: 12,
          children: [
            {
              id:"ab",
              name: "Labrador",
              checked: true,
              numberOfProductsAssociated: 10,
            },
            {
              id:"abc",
              name: "Berger Allemand",
              checked: true,
              numberOfProductsAssociated: 2,
            },
          ]
        },
        {


          status: "ACTIVE",
          id: "b",
          name: "Chat",
          checked: true,
          indeterminate: false,
        },
      ],
    },
    {
      status: "ACTIVE",
      id: "8",
      countryCode: "FR",
      languageCode: "fr",
      name: "Arts et loisirs",
      checked: false,
      indeterminate: false,
    },
    {
      status: "ACTIVE",
      id: "166",
      countryCode: "FR",
      languageCode: "fr",
      name: "Vêtements et accessoires",
      checked: true,
      indeterminate: false,
      numberOfProductsAssociated: 24,
      children: [
        {
          status: "ACTIVE",
          id: "111",
          name: "Entreprise et industrie",
          checked: true,
          numberOfProductsAssociated: 12,
        },
        {
          status: "ACTIVE",
          id: "141",
          name: "Appareils photo, caméras et instruments d'optique",
          checked: true,
          numberOfProductsAssociated: 12,
        },
      ]
    },
    {
      status: "ACTIVE",
      id: "222",
      countryCode: "FR",
      languageCode: "fr",
      name: "Appareils électroniques",
      checked: false,
      indeterminate: false,
    },
    {
      status: "ACTIVE",
      id: "412",
      countryCode: "FR",
      languageCode: "fr",
      name: "Alimentation, boissons et tabac",
      checked: false,
      indeterminate: false,
    },
    {
      status: "ACTIVE",
      id: "436",
      countryCode: "FR",
      languageCode: "fr",
      name: "Meubles",
      checked: false,
      indeterminate: false,
    },
],
}];

export const campaignWithUnhandledFilters = {
  campaignName: 'A super name',
  campaignDurationStartDate: '2021-10-30',
  campaignDurationEndDate: '2021-12-30',
  campaignProductsFilter: [],
  campaignDailyBudget: 7,
  campaignIsActive: true,
  campaignId: 'foo',
  targetCountry: ['France'],
  campaignHasNoProductsFilter: false,
  filtersChosen: [
    {
      dimension: 'categories',
      values: ['42'],
    },
  ],
  hasUnhandledFilters: true,
};
export const campaignWithoutUnhandledFilters = {
 ...campaignWithUnhandledFilters,
  hasUnhandledFilters: false,
};

export default sscDefault;
