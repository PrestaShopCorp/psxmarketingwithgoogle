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

export interface GoogleAccount {
  token: string,
  expiryDateToken: number,
  details: oauthApi.Schema$Userinfo,
  mcaSelectionOptions: contentApi.Schema$Account[],
  connectedOnce: boolean,
}

export type GoogleAccountContext = GoogleAccount & {
  authenticationUrl: string,

  from?: string,
  message?: string,
  status?: string,
}

export type MerchantCenterAccountContext = contentApi.Schema$Account & {
  // Allow the spinner to be displayed while claiming is done
  isVerified: boolean,
  isClaimed: boolean,
  // Allow displaying the error message
  websiteVerificationStatus: WebsiteClaimErrorReason|null,
};

export interface State {
  contextPsAccounts: PrestaShopAccountsContext|any;
  shopIdPsAccounts: string;
  googleAccount: GoogleAccountContext;
  googleMerchantAccount: MerchantCenterAccountContext;
}

export enum WebsiteClaimErrorReason {
  Disapproved = 'Disapproved',
  Expiring = 'Expiring',
  Pending = 'Pending',
  Overwrite = 'Overwrite',
  ShopInfoMissing = 'ShopInfoMissing',
}

export const state: State = {
  contextPsAccounts: {},
  shopIdPsAccounts: '',
  googleAccount: {
    token: '',
    expiryDateToken: 0,
    details: {},
    mcaSelectionOptions: [],
    authenticationUrl: '',
    connectedOnce: false,
  },
  googleMerchantAccount: {
    id: null,
    isVerified: false,
    isClaimed: false,
    websiteVerificationStatus: null,
    users: [],
  },
};
