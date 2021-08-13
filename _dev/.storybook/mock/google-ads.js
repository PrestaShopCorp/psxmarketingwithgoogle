export const googleAdsNotChosen = {
  status: null,
  accountChosen: null,
  shopInfos: {
    country: {
      // eslint-disable-next-line camelcase
      iso_code: null,
      name: null,
    },
    currency: 'DIR',
    timeZone: {
      text: null,
      offset: null,
    },
  },
  list: [
    {
      id: 4150564877,
      name: 'Lui Corpette',
      isAdmin: false,
    },
    {
      id: 4150564874,
      name: 'Tata Corpette',
      isAdmin: false,
    },
    {
      id: 4150564875,
      name: 'Tutu Corpette',
      isAdmin: true,
    },
  ],
};

export const googleAdsAccountChosen = {
  ...googleAdsNotChosen,
  accountChosen:  {
    id: 4150564874,
    name: 'Tata Corpette',
    isAdmin: false,
  },
}


export default googleAdsNotChosen;
