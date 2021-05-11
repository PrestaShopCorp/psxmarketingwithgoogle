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
import MutationsTypes from './mutations-types';
import {State as LocalState, MerchantCenterAccount} from './state';

interface OnboardStatus {
  // TODO: To be defined from response structure
  email: string;
}

export default {
  [MutationsTypes.SAVE_ONBOARD_STATUS](state: LocalState, response: OnboardStatus) {
    const {email} = response;
    state.googleAccount = {
      ...state.googleAccount,
      email,
    };
  },
  [MutationsTypes.SAVE_GOOGLE_ACCOUNT_TOKEN](state: LocalState, token: string) {
    state.googleAccount.token = token;
  },
  [MutationsTypes.SAVE_MCA_ACCOUNT](state: LocalState, selectedAccount: MerchantCenterAccount) {
    state.googleMerchantAccount = Object.assign(
      {},
      state.googleMerchantAccount,
      selectedAccount,
    );
  },
  [MutationsTypes.REMOVE_MCA_ACCOUNT](state: LocalState) {
    state.googleMerchantAccount = {
      ...state.googleMerchantAccount,
      id: null,
      websiteVerificationProgressStatus: null,
      websiteVerificationStatus: null,
    };
  },
  [MutationsTypes.SAVE_MCA_WEBSITE_VERIFICATION_PROGRESS_STATUS](state: LocalState, newStatus: string|null) {
    // ToDo: Add some validation about possible values?

    state.googleMerchantAccount.websiteVerificationProgressStatus = newStatus;
  },
  [MutationsTypes.SAVE_MCA_WEBSITE_VERIFICATION_STATUS](state: LocalState, newStatus: string|null) {
    // ToDo: Add some validation about possible values?

    state.googleMerchantAccount.websiteVerificationStatus = newStatus;
  },
};
