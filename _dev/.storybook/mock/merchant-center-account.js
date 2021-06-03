export const merchantCenterAccountNotConnected = {
    websiteVerificationStatus: null,
    isClaimed: false,
    isVerified: false,
    id: null,
    claimError: null,
    users: [],
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

export const merchandCenterAccountNotConnectedWithOverwriteClaim = {
  ...merchantCenterAccountConnected,
  claimError: 'Overwrite',
}

export const merchandCenterAccountNotConnectedWithExpiringError = {
  ...merchantCenterAccountConnected,
  claimError: 'Expiring',
}

export const merchandCenterAccountNotConnectedWithDisapprovedStatus = {
  ...merchantCenterAccountConnected,
  claimError: 'Disapproved',
}

export const merchandCenterAccountNotConnectedWithShopInfoMissing = {
  ...merchantCenterAccountConnected,
  claimError: 'ShopInfoMissing',
}

export default merchantCenterAccountConnected;
