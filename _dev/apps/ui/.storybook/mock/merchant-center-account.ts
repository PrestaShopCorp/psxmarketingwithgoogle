import cloneDeep from 'lodash.clonedeep';
import {MerchantCenterAccountContext, state} from '@/store/modules/accounts/state';

export const merchantCenterAccountNotConnected: MerchantCenterAccountContext = {
  ...state.googleMerchantAccount,
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
      {
          "emailAddress": "someonesadress@prestashop.com",
          "admin": true
      }
  ],
}

export const merchantCenterAccountConnectedOnce = {
    ...merchantCenterAccountConnected,
    connectedOnce: true,
};

export const merchantCenterAccountCreation = {
  ...merchantCenterAccountNotConnected,
}

export const merchantCenterAccountWithErrors: MerchantCenterAccountContext = {
  ...merchantCenterAccountNotConnected,
  shopInfo: {
    shop: {
      name: "PrestaShop",
      url: "http://perdu.com/"
    },
    store:{
      country: {
        isoCode: "FR",
        name: "France",
      },
      locality: "",
      phone: "qsdsqd",
      postalCode: "75015",
      streetAddress: "12 rue d'amsterdam",
      region: '',
    }
  }
}

export const merchantCenterAccountCreationReady: MerchantCenterAccountContext = cloneDeep(merchantCenterAccountWithErrors);
merchantCenterAccountCreationReady.shopInfo.store.locality = 'Paris';
merchantCenterAccountCreationReady.shopInfo.store.phone = '0102030405';
merchantCenterAccountCreationReady.shopInfo.store.region = 'Ile de France';

export const merchantCenterNewGmcNotListed = {
  ...merchantCenterAccountConnected,
  id: '246797534',
  name: null,
}

export const merchantCenterPhoneVerificationNeeded = {
  ...merchantCenterAccountConnected,
  isClaimed: true,
  isVerified: true,
  id: '246797534',
  name: 'Maison Royer',
  websiteUrl: "http://perdu.com",
  adultContent: false,
  claimError: '',
  users: [
    {
        "emailAddress": "someonesadress@prestashop.com",
        "admin": true
    }
  ],
}

export default merchantCenterAccountConnected;
