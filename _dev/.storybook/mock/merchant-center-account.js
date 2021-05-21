export const merchantCenterAccountNotConnected = {
    websiteVerificationStatus: null,
    isClaimed: false,
    isVerified: false,
    id: null,
    claimError: null,
    users: [],
};

export const merchandCenterAccountNotConnectedWithOverwriteClaim = {
  websiteVerificationStatus: null,
  isClaimed: false,
  isVerified: false,
  id: null,
  claimError: 'Overwrite',
  users: [],
}

export const merchandCenterAccountNotConnectedWithExpiringError = {
  websiteVerificationStatus: null,
  isClaimed: false,
  isVerified: false,
  id: null,
  claimError: 'Expiring',
  users: [],
}

export const merchandCenterAccountNotConnectedWithDisapprovedStatus = {
  websiteVerificationStatus: null,
  isClaimed: false,
  isVerified: false,
  id: null,
  claimError: 'Disapproved',
  users: [],
}

export const merchandCenterAccountNotConnectedWithShopInfoMissing = {
  websiteVerificationStatus: null,
  isClaimed: false,
  isVerified: false,
  id: null,
  claimError: 'ShopInfoMissing',
  users: [],
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
