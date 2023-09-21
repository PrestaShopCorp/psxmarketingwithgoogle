/**
 * 2007-2021 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

import {content_v2_1 as contentApi} from '@googleapis/content/v2.1';
import {oauth2_v2 as oauthApi} from '@googleapis/oauth2/v2';

export interface PrestaShopAccountsContext {
  user: {
    email: string|null,
    emailIsValidated: boolean,
    isSuperAdmin: boolean,
  },
  currentShop: {
      id: string;
      name: string;
      domain: string;
      domainSsl: string;
      url: string;
  },
  isShopContext: boolean,
  shops: object[],
}

export interface ShopInformations {
  shop: {
    name: string,
    url: string,
  },
  store: {
    streetAddress: string,
    locality: string,
    region: string,
    postalCode: string,
    country: {
      name: string,
      isoCode: string,
    },
    phone: string,
  }
}

export interface GoogleMerchantAccount extends contentApi.Schema$Account {
  aggregatorId?: string;
  aggregatorName?: string;
  subAccountNotManagedByPrestashop?: boolean;
}

export interface GoogleAccount {
  details: oauthApi.Schema$Userinfo,
  mcaSelectionOptions: GoogleMerchantAccount[] | null,
}

export interface GoogleAccountToken {
  // eslint-disable-next-line camelcase
  access_token: string|Error,
  // eslint-disable-next-line camelcase
  expiry_date: number,
}

export type GoogleAccountContext = GoogleAccount
& GoogleAccountToken & {
  authenticationUrl: string|Error,
  connectedOnce: boolean,
  missingTokenScopes: Array<string>,
  from?: string,
  message?: string,
  status?: string,
}

export type ShoppingWebsiteStatusFlag = {
  status: boolean;
  issues?: contentApi.Schema$AccountStatusAccountLevelIssue[];
}

export type MerchantCenterAccountContext = GoogleMerchantAccount & {
  // Allow the spinner to be displayed while claiming is done
  isVerified: boolean,
  isClaimed: boolean,
  isPhoneVerified: ShoppingWebsiteStatusFlag,
  isSuspended: ShoppingWebsiteStatusFlag,
  isEnhancedFreeListingCompliant: ShoppingWebsiteStatusFlag,
  gmcStatus: WebsiteClaimErrorReason|null,
  websiteRequirements: Array<String>,
  // Display toast component once
  connectedOnce: boolean,
  connectedAutomatically: boolean,
  shopInfo: ShopInformations,
  aggregatorId? : string,
};

export interface State {
  warmedUp: boolean,
  contextPsAccounts: PrestaShopAccountsContext|any;
  shopIdPsAccounts: string;
  tokenPsAccounts: string;
  googleAccount: GoogleAccountContext;
  googleMerchantAccount: MerchantCenterAccountContext;
  mcaPrestashopId: string;
}

export enum WebsiteClaimErrorReason {
  // States with warnings
  LinkingFailed = 'LinkingFailed',
  ShopInfoMissing = 'ShopInfoMissing',
  OverwriteNeeded = 'OverwriteNeeded',
  AccountValidationFailed = 'AccountValidationFailed',
  OverwriteNeededWithManualAction = 'OverwriteNeededWithManualAction',
  UnlinkFailed = 'UnlinkFailed',
  PendingCheck = 'PendingCheck',
  PendingCreation = 'PendingCreation',
  StillPendingCreation = 'StillPendingCreation',
  PhoneVerificationNeeded = 'PhoneVerificationNeeded',
  // States with errors
  Suspended = 'Suspended',
}

export const state: State = {
  warmedUp: false,
  contextPsAccounts: {},
  shopIdPsAccounts: '',
  tokenPsAccounts: '',
  googleAccount: {
    access_token: '',
    expiry_date: 0,
    details: {},
    mcaSelectionOptions: null,
    authenticationUrl: '',
    connectedOnce: false,
    missingTokenScopes: [],
  },
  googleMerchantAccount: {
    id: null,
    isVerified: false,
    isClaimed: false,
    isPhoneVerified: {
      status: true,
    },
    isSuspended: {
      status: false,
    },
    isEnhancedFreeListingCompliant: {
      status: true,
    },
    gmcStatus: null,
    users: [],
    connectedOnce: false,
    connectedAutomatically: true,
    websiteRequirements: [],
    shopInfo: {
      shop: {
        name: '',
        url: '',
      },
      store: {
        streetAddress: '',
        locality: '',
        region: '',
        postalCode: '',
        country: {
          name: '',
          isoCode: '',
        },
        phone: '',
      },
    },
  },
  mcaPrestashopId: import.meta.env.VITE_AGGREGATOR_ID || '',
};
