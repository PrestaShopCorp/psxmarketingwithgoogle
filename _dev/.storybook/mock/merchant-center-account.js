export const merchantCenterAccountNotConnected = {
    websiteVerificationStatus: null,
    isClaimed: false,
    isVerified: false,
    isSuspended: {
        status: false,
    },
    isEnhancedFreeListingCompliant: {
        status: true,
    },
    connectedOnce: false,
    id: null,
    claimError: null,
    users: [],
    websiteRequirements: [],
};

export const merchantCenterAccountConnected = {
  ...merchantCenterAccountNotConnected,
  isClaimed: true,
  isVerified: true,
  id: '246797534',
  name: 'Maison Royer',
  websiteUrl: "http://perdu.com",
  adultContent: false,
  claimError: '',
  users: [
      // ToDo: Fill it with mocked data
  ],
}

export const merchantCenterAccountConnectedOnce = {
    ...merchantCenterAccountConnected,
    connectedOnce: true,
};

export const merchantCenterAccountCreation = {
  ...merchantCenterAccountNotConnected,
  shopInfo: {
    shop: {
      name: "PrestaShop",
      url: "http://perdu.com/"
    },
    store:{
      country: {
        iso_code: "FR",
        name: "France",
      },
      locality: "Paris",
      phone: "0658585858",
      postalCode: "75015",
      region: false,
      streetAddress: "12 rue d'amsterdam",
    }
  }
}

export default merchantCenterAccountConnected;
