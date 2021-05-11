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
import ActionsTypes from './actions-types';
import {MerchantCenterAccount} from './state';

export default {
  async [ActionsTypes.TRIGGER_ONBOARD_TO_GOOGLE_ACCOUNT]({commit, state}, webhookUrl: String) {
    try {
      const response = await fetch(`${state.psGoogleShoppingApiUrl}/account/onboard`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(webhookUrl),
      });
      const json = await response.json();
      commit(MutationsTypes.SAVE_ONBOARD_STATUS, json);
    } catch (error) {
      console.error(error);
    }
  },
  [ActionsTypes.SAVE_SELECTED_GOOGLE_ACCOUNT]({commit}, selectedAccount: MerchantCenterAccount) {
    commit(MutationsTypes.SAVE_MCA_ACCOUNT, selectedAccount);
    commit(MutationsTypes.SAVE_MCA_WEBSITE_VERIFICATION_PROGRESS_STATUS, 'checking');
      setTimeout(() => {
        commit(MutationsTypes.SAVE_MCA_WEBSITE_VERIFICATION_PROGRESS_STATUS, 'doneAlert');
        setTimeout(() => {
          commit(MutationsTypes.SAVE_MCA_WEBSITE_VERIFICATION_PROGRESS_STATUS, 'done');
        }, 2000);
      }, 2000);
  }
};
