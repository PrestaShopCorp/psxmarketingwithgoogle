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
import MutationsTypes from './mutations-types';
import {
  State as LocalState,
  GoogleAccount,
  GoogleAccountToken,
  MerchantCenterAccountContext,
} from './state';

export default {
  /** Google Account mutations */
  [MutationsTypes.SET_GOOGLE_ACCOUNT](state: LocalState, response: GoogleAccount) {
    state.googleAccount = {
      ...state.googleAccount,
      ...response,
    };
  },
  [MutationsTypes.SAVE_GOOGLE_ACCOUNT_TOKEN](
    state: LocalState,
    payload: GoogleAccountToken,
  ) {
    state.googleAccount.access_token = payload.access_token;
    state.googleAccount.expiry_date = payload.expiry_date;
  },
  [MutationsTypes.REMOVE_GOOGLE_ACCOUNT](state: LocalState) {
    state.googleAccount.access_token = '';
    state.googleAccount.expiry_date = 0;
  },
  [MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL](state: LocalState, url: string) {
    state.googleAccount.authenticationUrl = url;
  },
  [MutationsTypes.SET_GOOGLE_AUTHENTICATION_RESPONSE](state: LocalState, googleResponse) {
    state.googleAccount.from = googleResponse.from;
    state.googleAccount.message = googleResponse.message;
    state.googleAccount.status = googleResponse.status;
  },
  [MutationsTypes.SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE](state: LocalState, response) {
    state.googleAccount.connectedOnce = response;
  },
  [MutationsTypes.SAVE_GOOGLE_ACCOUNT_MCA_LIST](
    state: LocalState,
    mcaSelectionOptions: contentApi.Schema$Account[],
  ) {
    state.googleAccount.mcaSelectionOptions = mcaSelectionOptions;
  },
  /** End of Google Account mutations */

  /** Merchant Center Account mutations */
  [MutationsTypes.SAVE_MCA_ACCOUNT](state: LocalState, selectedAccount: contentApi.Schema$Account) {
    state.googleMerchantAccount = {
      ...state.googleMerchantAccount,
      ...selectedAccount,
    };
  },
  [MutationsTypes.REMOVE_MCA_ACCOUNT](state: LocalState) {
    state.googleMerchantAccount = {
      ...state.googleMerchantAccount,
      id: null,
      websiteVerificationStatus: null,
    };
  },
  [MutationsTypes.SAVE_WEBSITE_CLAIMING_STATUS](
    state: LocalState,
    websiteClaimingStatus: MerchantCenterAccountContext,
  ) {
    state.googleMerchantAccount.isClaimed = websiteClaimingStatus.isClaimed;
    state.googleMerchantAccount.isVerified = websiteClaimingStatus.isVerified;
  },
  /** End of Merchant Center Account mutations */
};
