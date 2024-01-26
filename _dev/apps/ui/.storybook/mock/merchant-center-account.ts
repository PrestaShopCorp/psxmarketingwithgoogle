import cloneDeep from 'lodash.clonedeep';
import {MerchantCenterAccountContext, state} from '@/store/modules/accounts/state';

export const merchantCenterAccountNotConnected: MerchantCenterAccountContext = {
  ...state.googleMerchantAccount,
};

export const merchantCenterAccountConnected: MerchantCenterAccountContext = {
  ...merchantCenterAccountNotConnected,
  isClaimed: true,
  isVerified: true,
  id: '246797534',
  name: 'Maison Royer',
  websiteUrl: "http://perdu.com",
  adultContent: false,
  users: [
      {
          "emailAddress": "someonesadress@prestashop.com",
          "admin": true
      }
  ],
}

export const merchantCenterAccountConnectedOnce: MerchantCenterAccountContext = {
    ...merchantCenterAccountConnected,
    connectedOnce: true,
};

export const merchantCenterAccountCreation: MerchantCenterAccountContext = {
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

export const merchantCenterNewGmcNotListed: MerchantCenterAccountContext = {
  ...merchantCenterAccountConnected,
  id: '246797534',
  name: null,
}

export const merchantCenterPhoneVerificationNeeded: MerchantCenterAccountContext = {
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

export const merchantCenterAccountSuspended: MerchantCenterAccountContext = {
  ...merchantCenterAccountConnected,
  accountIssues: [
    {
      title: 'Online store not confirmed',
      severity: 'ERROR',
      htmlContent:
        '\u003cdiv class="issue-detail"\u003e\u003cdiv class="issue-content"\u003e\u003cp class="content-element"\u003e\u003cspan class="segment"\u003eTo confirm your online store, you&#39;ll need to verify and claim it on Merchant Center. This lets Google know that you can act on behalf of your business to provide a safe shopping experience for customers. It doesn&#39;t give Google any access to your online store.\u003c/span\u003e\u003c/p\u003e\u003ca href="https://support.google.com/merchants/answer/176793?hl=en-US" class="content-element"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e',
    },
    {
      title: 'An exemple of warning',
      severity: 'WARNING',
      htmlContent:
        '\u003cdiv class="issue-detail"\u003e\u003cdiv class="issue-content"\u003e\u003cp class="content-element"\u003e\u003cspan class="segment"\u003eProvided store name: The Shop Name. Used store name: some.url.com/fr\u003c/span\u003e\u003c/p\u003e\u003ca href="https://support.google.com/merchants/answer/6101130" class="content-element"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e',
    },
    {
      title: 'Invalid store name',
      severity: 'INFO',
      htmlContent:
        '\u003cdiv class="issue-detail"\u003e\u003cdiv class="issue-content"\u003e\u003cp class="content-element"\u003e\u003cspan class="segment"\u003eProvided store name: The Shop Name. Used store name: some.url.com/fr\u003c/span\u003e\u003c/p\u003e\u003ca href="https://support.google.com/merchants/answer/6101130" class="content-element"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e',
    },
  ],
};

export default merchantCenterAccountConnected;
