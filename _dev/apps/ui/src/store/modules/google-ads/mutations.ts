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
import {
  State as LocalState,
  GoogleAdsErrorReason,
  AccountInformations,
} from './state';

export default {
  [MutationsTypes.SET_GOOGLE_ADS_LIST](state: LocalState, payload: Array<AccountInformations>) {
    state.list = payload;
  },
  [MutationsTypes.SET_GOOGLE_ADS_STATUS](state: LocalState, payload: GoogleAdsErrorReason) {
    state.status = payload;
  },
  [MutationsTypes.SET_GOOGLE_ADS_ACCOUNT](state: LocalState, payload: AccountInformations|null) {
    state.accountChosen = payload;
  },
  [MutationsTypes.SET_BILLING_SHOP_INFORMATIONS](state:LocalState, payload) {
    state.currency = payload.currency;
    state.timeZone = payload.timeZone;
  },
  [MutationsTypes.SET_GOOGLE_ADS_ACCOUNT_ID](state: LocalState, payload: string) {
    if (state.accountChosen === null) {
      state.accountChosen = {
        id: payload,
      };
      return;
    }
    state.accountChosen.id = payload;
  },
  [MutationsTypes.ADD_NEW_GOOGLE_ADS_ACCOUNT](
    state: LocalState, payload: AccountInformations) {
    if (state.list) {
      state.list.push(payload);
    }
  },
  [MutationsTypes.SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE](
    state: LocalState, payload: boolean) {
    state.connectedOnce = payload;
  },
};
