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

import {
  State as LocalState,
  PrestaShopAccountsContext,
  GoogleAccountsContext,
  MerchantCenterAccount,
  MerchantCenterAccountContext,
} from './state';
import GetterTypes from './getters-types';

export default {
  /* PrestaShop Account */
  [GetterTypes.GET_PS_ACCOUNTS_IS_ONBOARDED](state: LocalState): boolean {
    return state.contextPsAccounts.user.emailIsValidated
      && state.contextPsAccounts.user.email !== '';
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
    return !!state.googleAccount.token.length;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_TOKEN](state: LocalState) : String {
    return state.googleAccount.token;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT](state: LocalState) : GoogleAccountsContext {
    return state.googleAccount;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_MCA_LIST](state: LocalState) : MerchantCenterAccount[] {
    return state.googleAccount.mcaSelectionOptions;
  },
  /* Merchant Center Account */
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT](state: LocalState) :
    MerchantCenterAccountContext {
    return state.googleMerchantAccount;
  },
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED](state: LocalState) : boolean {
    return !!(state.googleMerchantAccount.id
      && state.googleMerchantAccount.websiteVerificationProgressStatus
      && ['done', 'doneAlert'].indexOf(state.googleMerchantAccount.websiteVerificationProgressStatus) !== -1);
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_AUTHENTICATION_URL](state: LocalState) : String {
    return state.googleAccount.authenticationUrl;
  },
};
