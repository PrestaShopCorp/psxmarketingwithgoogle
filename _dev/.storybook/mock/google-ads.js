export const googleAdsNotChosen = {
  status: null,
  accountChosen: null,
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
  ...googleAdsAccountChosen,
  accountChosen:  {
    id: 4150564874,
    name: 'Tata Corpette',
    isAdmin: false,
  },
}


export default googleAdsNotChosen;
