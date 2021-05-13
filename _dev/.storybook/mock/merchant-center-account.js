export const merchantCenterAccountNotConnected = {
    websiteVerificationProgressStatus: null,
    websiteVerificationStatus: null,
    id: null,
};

export const merchantCenterAccountConnected = {
    ...merchantCenterAccountNotConnected,
    websiteVerificationProgressStatus: 'done',
    id: '246797534',
    name: 'Maison Royer',
    websiteUrl: "http://perdu.com",
    adultContent: false,
}

export default merchantCenterAccountConnected;
