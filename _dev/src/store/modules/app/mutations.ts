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
  HelpInformations,
  DebugData,
} from './state';

export default {
  [MutationsTypes.SAVE_DOC_AND_FAQ](state: LocalState, response: HelpInformations) {
    state.psxMktgWithGoogleDocumentAndFaq = response;
  },
  [MutationsTypes.SAVE_DEBUG_DATA](state: LocalState, response: DebugData) {
    state.debugData = response;
  },
  [MutationsTypes.AD_BLOCKER_EXISTS](state: LocalState) {
    state.adBlockerExists = !state.adBlockerExists;
  },
  [MutationsTypes.SAVE_USER_IS_LOGGED_OUT](state: LocalState) {
    state.backOfficeUserIsLoggedIn = false;
  },
};
