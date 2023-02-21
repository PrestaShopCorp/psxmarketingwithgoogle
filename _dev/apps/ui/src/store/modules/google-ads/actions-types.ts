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

enum ActionsTypes {
  WARMUP_STORE = 'WARMUP_STORE',
  GET_GOOGLE_ADS_LIST = 'GET_GOOGLE_ADS_LIST',
  SAVE_SELECTED_GOOGLE_ADS_ACCOUNT = 'SAVE_SELECTED_GOOGLE_ADS_ACCOUNT',
  SAVE_NEW_GOOGLE_ADS_ACCOUNT ='SAVE_NEW_GOOGLE_ADS_ACCOUNT',
  GET_GOOGLE_ADS_ACCOUNT = 'GET_GOOGLE_ADS_ACCOUNT',
  DISSOCIATE_GOOGLE_ADS_ACCOUNT = 'DISSOCIATE_GOOGLE_ADS_ACCOUNT',
  GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING = 'GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING',
}

export default ActionsTypes;
