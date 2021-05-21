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

import {
  State as LocalState,
  PrestaShopAccountsContext,
  GoogleAccountContext,
  MerchantCenterAccountContext,
  WebsiteClaimErrorReason,
} from './state';
import GetterTypes from './getters-types';

export default {
  /* PrestaShop Account */
  [GetterTypes.GET_PS_ACCOUNTS_IS_ONBOARDED](state: LocalState): boolean {
    return state.contextPsAccounts.user.emailIsValidated
      && state.contextPsAccounts.user.email !== '' && state.contextPsAccounts.isShopContext;
  },
  [GetterTypes.GET_PS_ACCOUNTS_CONTEXT](state: LocalState): PrestaShopAccountsContext {
    return state.contextPsAccounts;
  },
  [GetterTypes.GET_PS_ACCOUNTS_CONTEXT_SHOPS](state: LocalState) : Object[] {
    return state.contextPsAccounts && state.contextPsAccounts.shops
      ? state.contextPsAccounts.shops
      : [];
  },

  /* Google Account */
  [GetterTypes.GET_GOOGLE_ACCOUNT_IS_ONBOARDED](state: LocalState): boolean {
    return !!state.googleAccount.access_token.length;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_TOKEN](state: LocalState) : String {
    return state.googleAccount.access_token;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT](state: LocalState) : GoogleAccountContext {
    return state.googleAccount;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_MCA_LIST](state: LocalState) : contentApi.Schema$Account[] {
    return state.googleAccount.mcaSelectionOptions;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_CONNECTED_ONCE](state: LocalState) : boolean {
    return state.googleAccount.connectedOnce;
  },
  /* Merchant Center Account */
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT](state: LocalState) :
    MerchantCenterAccountContext {
    return state.googleMerchantAccount;
  },
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED](state: LocalState) : boolean {
    return !!(state.googleMerchantAccount.id
      && state.googleMerchantAccount.isClaimed && state.googleMerchantAccount.isVerified);
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_AUTHENTICATION_URL](state: LocalState) : String {
    return state.googleAccount.authenticationUrl;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS](state: LocalState) : String|null {
    return state.googleMerchantAccount.claimError;
  }
};
