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
} from './state';
import GettersTypes from './getters-types';

export default {
  [GettersTypes.GET_FREE_LISTING_STATUS](state: LocalState): boolean {
    return state.status;
  },
  [GettersTypes.GET_FREE_LISTING_STATUS_API](state: LocalState): boolean {
    return state.errorAPI;
  },
  [GettersTypes.GET_FREE_LISTING_IS_ACTIVATED_ONCE](state: LocalState): boolean {
    return state.isActivatedOnce;
  },

};
