export const googleAdsNotChosen = {
  status: null,
  accountChosen: null,
  list: [
    {
      id: '415-056-4877',
      name: 'Lui Corpette',
      isAdmin: false,
      isTestAccount: true,
    },
    {
      id: '415-056-4874',
      name: 'Tata Corpette',
      isAdmin: false,
      isTestAccount: false,
    },
    {
      id: '415-056-4875',
      name: 'Tutu Corpette',
      isAdmin: true,
      isTestAccount: false,
    },
  ],
};

export const googleAdsAccountChosenisTestAccount = {
  ...googleAdsNotChosen,
  accountChosen:  {
    id: '415-056-4875',
    name: 'Tata Corpette',
    isAdmin: false,
    isTestAccount: true,
    billingSettings: {
      isSet: false,
      link: 'string',
    },
    country: {
      // eslint-disable-next-line camelcase
      iso_code: '12',
      name: 'France'
    },
    currency: 'EUR',
    timeZone:  'USA',
  },
}
export const googleAdsAccountChosen = {
  ...googleAdsNotChosen,
  accountChosen:  {
    id: '415-056-4875',
    name: 'Tata Corpette',
    isAdmin: false,
    isTestAccount: false,
    billingSettings: {
      isSet: true,
      link: 'string',
    },
    country: {
      // eslint-disable-next-line camelcase
      iso_code: '12',
      name: 'France'
    },
    currency: 'EUR',
    timeZone:  'USA',
  },
}

export const googleAdsAccountConnectedOnce = {
  ...googleAdsAccountChosen,
  connectedOnce: true,
};



export default googleAdsNotChosen;
