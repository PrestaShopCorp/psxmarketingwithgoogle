import { state } from "@/store/modules/accounts/state";
import { GoogleAccountContext } from "@/store/modules/accounts/state";

export const googleAccountNotConnected: GoogleAccountContext = {
  ...state.googleAccount,
};

export const googleAccountNotConnectedButAuthenticationUrlOK: GoogleAccountContext = {
  ...googleAccountNotConnected,
  authenticationUrl: "#",
};

export const googleAccountFailedToRetrieveAuthenticationUrl: GoogleAccountContext = {
  ...googleAccountNotConnected,
  authenticationUrl: new Error(),
};

export const googleAccountFailedToRetrieveToken: GoogleAccountContext = {
  ...googleAccountNotConnected,
  access_token: new Error(),
};

export const googleAccountConnected: GoogleAccountContext = {
  ...googleAccountNotConnected,
  access_token: "wololo",
  expiry_date: 999999999999999,
  details: {
    email: "v.godard@maisonroyer.com",
    picture: "//source.unsplash.com/bul_3zwYI6E/38x38",
  },
  missingTokenScopes: [],
  mcaSelectionOptions: [
    {
      aggregatorId: "123244194",
      kind: "content#account",
      id: "260544545",
      name: "EM-1597829909",
      websiteUrl: "http://test.com",
      adultContent: false,
      adsLinks: [
        {
          adsId: "5560173801",
          status: "active",
        },
      ],
      users: [
        {
          emailAddress: "sam.euva@gmail.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "sam.fechiay@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "romain.bocheux@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "v.godard@maisonroyer.com",
          admin: false,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      kind: "content#account",
      id: "415066797",
      name: "Lui Corp",
      websiteUrl: "http://test-svp.io/",
      adultContent: false,
      users: [
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
      ],
      businessInformation: {
        address: {
          country: "FR",
        },
      },
    },
    {
      kind: "content#account",
      id: "4150564877",
      name: "Lui Corpette",
      websiteUrl: "http://test-svp.io/",
      adultContent: false,
      users: [
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: false,
        },
      ],
      businessInformation: {
        address: {
          country: "FR",
        },
      },
    },
    {
      aggregatorId: "381504106",
      aggregatorName: "PrestaShop",
      kind: "content#account",
      id: "376762572",
      name: "PrestaShop Production 1",
      adultContent: false,
      users: [
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "sam.fechiay@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
      ],
      businessInformation: {
        address: {
          country: "FR",
        },
      },
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "380838735",
      name: "aaaa",
      websiteUrl: "http://test1.com",
      adultContent: false,
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "380843907",
      name: "aaaa2",
      websiteUrl: "http://test1.com",
      adultContent: false,
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "346108237",
      name: "Amaury 03T",
      websiteUrl: "https://bisous.com",
      adultContent: false,
      adsLinks: [
        {
          adsId: "1271341591",
          status: "active",
        },
      ],
      businessInformation: {
        address: {
          streetAddress: "17  rue du Fossé des Tanneurs\n2ème étage",
          locality: "Toulon",
          region: "Choose your state (if applicable)",
          postalCode: "93100",
        },
        customerService: {
          url: "https://bisous.com/nous-contacter",
          email: "bisous@prestashop.com",
          phoneNumber: "0033700-5557-31",
        },
      },
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "343845365",
      name: "CDE demoniak",
      websiteUrl: "http://perdu.com",
      adultContent: false,
      adsLinks: [
        {
          adsId: "9739389786",
          status: "active",
        },
      ],
      businessInformation: {
        address: {
          country: "FR",
        },
      },
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: false,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "352543826",
      name: "margud",
      websiteUrl: "http://lost.com",
      adultContent: false,
      adsLinks: [
        {
          adsId: "9912280860",
          status: "active",
        },
      ],
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "416810554",
      name: "Maxence",
      websiteUrl: "https://www.myshop.com",
      adultContent: false,
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "435547741",
      name: "Maxime",
      websiteUrl: "http://placeholer.com",
      adultContent: false,
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "441717859",
      name: "my-shop-toto",
      websiteUrl: "https://www.toto.com",
      adultContent: false,
      businessInformation: {
        address: {
          country: "FR",
        },
      },
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
    {
      aggregatorId: "343942372",
      aggregatorName: "PrestaShop Dev",
      kind: "content#account",
      id: "441815519",
      name: "shop-name",
      websiteUrl: "https://www.toto.com",
      adultContent: false,
      businessInformation: {
        address: {
          country: "FR",
        },
      },
      users: [
        {
          emailAddress: "jean.flure@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jean.neymard@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "chuck.van-damme@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "joe.nathan@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "tom.esamilles@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "yvan.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "igor.unetitegoutte@prestashop.com",
          admin: true,
        },
        {
          emailAddress: "jay.malodo@prestashop.com",
          admin: true,
        },
      ],
      subAccountNotManagedByPrestashop: true,
    },
  ],
};

export const googleAccountConnectedOnce: GoogleAccountContext = {
  ...googleAccountConnected,
  connectedOnce: true,
};

export const googleAccountMissingTokenScopes: GoogleAccountContext = {
  ...googleAccountConnected,
  missingTokenScopes: ["foo"],
};

export default googleAccountConnected;
