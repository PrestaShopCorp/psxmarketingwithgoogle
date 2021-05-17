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

import {MerchantCenterAccount} from 'stories/onboarding-page.stories';

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
  email: string,
  photo: string,
  mcaSelectionOptions: MerchantCenterAccount[],
}

export type GoogleAccountContext = GoogleAccount & {
  authenticationUrl: string,

  from?: string,
  message?: string,
  status?: string,
}

/** @see https://developers.google.com/shopping-content/reference/rest/v2.1/accounts#Account */
export interface MerchantCenterAccount {
  id: string|null,
  name?: string,
  websiteUrl?: string,
  adultContent?: string,
  users: MerchantCenterAccountUser[],
}

export interface MerchantCenterAccountUser {
  emailAddress: string,
  admin: boolean,
  orderManager: boolean,
  paymentsManager: boolean,
  paymentsAnalyst: boolean
}

export type MerchantCenterAccountContext = MerchantCenterAccount & {
  // Allow the spinner to be displayed while claiming is done
  websiteVerificationProgressStatus: WebsiteClaimProgressStatus|null,
  // Allow displaying the error message
  websiteVerificationStatus: WebsiteClaimErrorReason|null,
};

export interface State {
  contextPsAccounts: PrestaShopAccountsContext|any;
  shopIdPsAccounts: string;
  googleAccount: GoogleAccountContext;
  googleMerchantAccount: MerchantCenterAccountContext;
}

export enum WebsiteClaimProgressStatus {
  Checking,
  Done,
  // ToDo: Find a better name (or move it in the component state)
  DoneWithToast,
}

export enum WebsiteClaimErrorReason {
  Disapproved = 'Disapproved',
  Expiring = 'Expiring',
  Pending = 'Pending',
  Overwrite = 'Overwrite',
}

export const state: State = {
  contextPsAccounts: {},
  shopIdPsAccounts: '',
  googleAccount: {
    token: '',
    email: '',
    photo: '',
    mcaSelectionOptions: [],

    authenticationUrl: '',
  },
  googleMerchantAccount: {
    id: null,
    websiteVerificationProgressStatus: null,
    websiteVerificationStatus: null,
    users: [],
  },
};
