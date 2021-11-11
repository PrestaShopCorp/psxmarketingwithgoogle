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
  GoogleAdsErrorReason,
  AccountInformations,
} from './state';
import GettersTypes from './getters-types';

export default {
  [GettersTypes.GET_GOOGLE_ADS_STATUS](state: LocalState)
    : GoogleAdsErrorReason|null {
    if (state.status) {
      return state.status;
    }
    return null;
  },
  [GettersTypes.GET_GOOGLE_ADS_LIST_OPTIONS](state: LocalState): Array<AccountInformations>|null {
    return state.list;
  },
  [GettersTypes.GET_GOOGLE_ADS_ACCOUNT_CHOSEN](state: LocalState): AccountInformations|null {
    return state.accountChosen;
  },
  [GettersTypes.GET_GOOGLE_ADS_ACCOUNT_IS_SERVING](state: LocalState): boolean {
    return !!state.accountChosen?.id?.length && !!state.accountChosen.billingSettings?.isSet;
  },
  [GettersTypes.GET_BILLING_SHOP_INFORMATIONS](state: LocalState): object {
    return {
      currency: state.currency,
      timeZone: state.timeZone,
    };
  },
  [GettersTypes.GET_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE](state: LocalState) {
    return state.connectedOnce;
  },
};
