export const merchantCenterAccountNotConnected = {
    websiteVerificationStatus: null,
    isClaimed: false,
    isVerified: false,
    id: null,
    claimError: null,
    users: [],
};

export const merchandCenterAccountNotConnectedWithOverwriteClaim = {
  ...merchantCenterAccountNotConnected,
  isClaimed: true,
  isVerified: true,
  id: '246797534',
  name: 'Maison Royer',
  websiteUrl: "http://perdu.com",
  adultContent: false,
  users: [
      // ToDo: Fill it with mocked data
  ],
  claimError: 'Overwrite',
}

export const merchandCenterAccountNotConnectedWithExpiringError = {
  ...merchantCenterAccountNotConnected,
  isClaimed: true,
  isVerified: true,
  id: '246797534',
  name: 'Maison Royer',
  websiteUrl: "http://perdu.com",
  adultContent: false,
  users: [
      // ToDo: Fill it with mocked data
  ],
  claimError: 'Expiring',
}

export const merchandCenterAccountNotConnectedWithDisapprovedStatus = {
  ...merchantCenterAccountNotConnected,
  isClaimed: true,
  isVerified: true,
  id: '246797534',
  name: 'Maison Royer',
  websiteUrl: "http://perdu.com",
  adultContent: false,
  users: [
      // ToDo: Fill it with mocked data
  ],
  claimError: 'Disapproved',
}

export const merchandCenterAccountNotConnectedWithShopInfoMissing = {
  ...merchantCenterAccountNotConnected,
  isClaimed: true,
  isVerified: true,
  id: '246797534',
  name: 'Maison Royer',
  websiteUrl: "http://perdu.com",
  adultContent: false,
  users: [
      // ToDo: Fill it with mocked data
  ],
  claimError: 'ShopInfoMissing',
}


export const merchantCenterAccountConnected = {
    ...merchantCenterAccountNotConnected,
    isClaimed: true,
    isVerified: true,
    id: '246797534',
    name: 'Maison Royer',
    websiteUrl: "http://perdu.com",
    adultContent: false,
    claimError: null,
    users: [
        // ToDo: Fill it with mocked data
    ],
}

export default merchantCenterAccountConnected;
