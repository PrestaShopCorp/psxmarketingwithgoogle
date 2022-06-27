export const defaultCampaigns = {
  campaigns: {
    sscList: [],
    pMaxList: [],
  },
  tracking: null,
  tagAlreadyExists: false
};


export const sscTrackingIsTrue = {
  ...defaultCampaigns,
  tracking: true,
};


export const sscTrackingIsFalse = {
  ...defaultCampaigns,
  tracking: false,
};


export const sscTagAlreadyExists = {
  ...defaultCampaigns,
  tracking: true,
  tagAlreadyExists: true,
};

export const availableFilters = [{
      name: "smartShoppingCampaignCreation.categories",
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
              visible: true,
              indeterminate: false,
              numberOfProductsAssociated: 12,
              children: [
                {
                  id:"ab",
                  countryCode: "FR",
                  languageCode: "fr",
                  name: "Labrador",
                  checked: true,
                  visible: true,
                  numberOfProductsAssociated: 10,
                },
                {
                  id:"abc",
                  countryCode: "FR",
                  languageCode: "fr",
                  name: "Berger Allemand",
                  checked: true,
                  visible: true,
                  numberOfProductsAssociated: 2,
                },
              ]
            },
            {


              status: "ACTIVE",
              id: "b",
              name: "Chat",
              checked: true,
              visible: true,
              indeterminate: false,
            },
          ],
        },
        {
          status: "ACTIVE",
          id: "8",
          name: "Arts et loisirs",
          checked: false,
          visible: true,
          indeterminate: false,
        },
        {
          status: "ACTIVE",
          id: "166",
          name: "Vêtements et accessoires",
          checked: true,
          indeterminate: false,
          visible: true,
          numberOfProductsAssociated: 13,
          children: [
            {
              status: "ACTIVE",
              id: "111",
              name: "Entreprise et industrie",
              checked: true,
              visible: true,
              numberOfProductsAssociated: 12,
            },
            {
              status: "ACTIVE",
              id: "141",
              name: "Appareils photo, caméras et instruments d'optique",
              checked: true,
              visible: true,
              numberOfProductsAssociated: 1,
            },
          ]
        },
        {
          status: "ACTIVE",
          id: "222",
          name: "Appareils électroniques",
          checked: false,
          visible: true,
          indeterminate: false,
        },
        {
          status: "ACTIVE",
          id: "412",
          name: "Alimentation, boissons et tabac",
          checked: false,
          visible: true,
          indeterminate: false,
        },
        {
          status: "ACTIVE",
          id: "436",
          name: "Meubles",
          checked: false,
          visible: true,
          indeterminate: false,
        },
  ],
},
{
  name: "Brand",
  id: "brand",
  checked: false,
  indeterminate: true,
  visible: true,
  children: [
    {
      status: "ACTIVE",
      id: "1",
      countryCode: "FR",
      languageCode: "fr",
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
          visible: true,
          numberOfProductsAssociated: 12,
          children: [
            {
              id:"ab",
              name: "Labrador",
              checked: true,
              visible: true,
              numberOfProductsAssociated: 10,
            },
            {
              id:"abc",
              name: "Berger Allemand",
              checked: true,
              visible: true,
              numberOfProductsAssociated: 2,
            },
          ]
        },
        {


          status: "ACTIVE",
          id: "b",
          name: "Chat",
          checked: true,
          visible: true,
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
      visible: true,
      indeterminate: false,
    },
    {
      status: "ACTIVE",
      id: "166",
      countryCode: "FR",
      languageCode: "fr",
      name: "Vêtements et accessoires",
      checked: true,
      visible: true,
      indeterminate: false,
      numberOfProductsAssociated: 24,
      children: [
        {
          status: "ACTIVE",
          id: "111",
          name: "Entreprise et industrie",
          checked: true,
          visible: true,
          numberOfProductsAssociated: 12,
        },
        {
          status: "ACTIVE",
          id: "141",
          name: "Appareils photo, caméras et instruments d'optique",
          checked: true,
          visible: true,
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
      visible: true,
      indeterminate: false,
    },
    {
      status: "ACTIVE",
      id: "412",
      countryCode: "FR",
      languageCode: "fr",
      name: "Alimentation, boissons et tabac",
      checked: false,
      visible: true,
      indeterminate: false,
    },
    {
      status: "ACTIVE",
      id: "436",
      countryCode: "FR",
      languageCode: "fr",
      name: "Meubles",
      checked: false,
      visible: true,
      indeterminate: false,
    },
],
}];

export const campaignWithUnhandledFilters = {
  campaignName: 'A super name',
  startDate: '2021-10-30',
  endDate: '2021-12-30',
  productFilters: [],
  campaignDailyBudget: 7,
  dailyBudget: true,
  id: 'foo',
  targetCountry: 'France',
  campaignHasNoProductsFilter: false,
  hasUnhandledFilters: true,
  type: "PERFORMANCE_MAX"
};

export const campaignWithoutUnhandledFilters = {
 ...campaignWithUnhandledFilters,
  hasUnhandledFilters: false,
};


export default defaultCampaigns;
