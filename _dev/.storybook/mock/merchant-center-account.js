export const merchantCenterAccountNotConnected = {
    websiteVerificationStatus: null,
    isClaimed: false,
    isVerified: false,
    id: null,
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
    users: [
        // ToDo: Fill it with mocked data
    ],
}

export default merchantCenterAccountConnected;
