export const merchantCenterAccountNotConnected = {
    websiteVerificationProgressStatus: null,
    websiteVerificationStatus: null,
    id: null,
    users: [],
};

export const merchantCenterAccountConnected = {
    ...merchantCenterAccountNotConnected,
    websiteVerificationProgressStatus: 'done',
    id: '246797534',
    name: 'Maison Royer',
    websiteUrl: "http://perdu.com",
    adultContent: false,
    users: [
        // ToDo: Fill it with mocked data
    ],
}

export default merchantCenterAccountConnected;
