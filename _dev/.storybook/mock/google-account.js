export const googleAccountNotConnected = {
    access_token: '',
    connectedOnce: false,
    details: {},
    mcaSelectionOptions: [],
};

export const googleAccountNotConnectedButAuthenticationUrlOK = {
    ...googleAccountNotConnected,
    authenticationUrl: '#',
};

export const googleAccountFailedToRetrieveAuthenticationUrl = {
    ...googleAccountNotConnected,
    authenticationUrl: new Error,
};

export const googleAccountFailedToRetrieveToken = {
    ...googleAccountNotConnected,
    access_token: new Error,
};

export const googleAccountConnected = {
    access_token: 'wololo',
    expiry_date: 999999999999999,
    details: {
        email: 'v.godard@maisonroyer.com',
        picture: '//source.unsplash.com/38x38',
    },
    mcaSelectionOptions: [
        {
            id: '123456789',
            name: 'V Godard',
            websiteUrl: 'http://perdu.com',
            adultContent: false,
            users: [
                {
                    admin: true,
                },
                {
                    admin: false,
                },
            ],
        },
        {
            id: '653367900',
            name: 'Royer et fils',
            websiteUrl: 'http://perdu.com',
            adultContent: false,
            users: [
                {
                    admin: true,
                },
                {
                    admin: false,
                },
            ],
        },
        {
            id: '246797534',
            name: 'Maison Royer',
            websiteUrl: 'http://perdu.com',
            adultContent: false,
            users: [
                {
                    admin: true,
                },
                {
                    admin: false,
                },
            ],
        },
        {
            id: '79747579864',
            name: 'Godard',
            websiteUrl: 'http://perdu.com',
            adultContent: false,
            users: [
                {
                    admin: true,
                },
                {
                    admin: false,
                },
            ],
        },
        {
            id: '678321007',
            name: 'Fondation Royer',
            websiteUrl: 'http://perdu.com',
            adultContent: false,
            users: [
                {
                    admin: false,
                },
                {
                    admin: false,
                },
            ],
        },
        {
            id: '6550365293011007',
            name: '🐶 Doge Shop',
            websiteUrl: 'http://perdu.com',
            adultContent: false,
            users: [
                {
                    admin: true,
                },
                {
                    admin: false,
                },
            ],
        },
    ]
};

export const googleAccountConnectedOnce = {
   ...googleAccountConnected,
   connectedOnce: true,
};


export default googleAccountConnected;