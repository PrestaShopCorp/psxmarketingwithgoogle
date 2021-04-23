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
export default {
  getValidationList({commit}) {
    fetch('')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((json) => {
        commit('setValidationListStatement', json);
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.log(error);
        Promise.reject(new Error(error));
      });
  },

  getSummaryValidation({commit}) {
    fetch('')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((json) => {
        commit('setSummaryValidation', json);
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.log(error);
        Promise.reject(new Error(error));
      });
  },

  sendFreeListingStatement({commit}, payload) {
    fetch('', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(payload),
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
      .then((json) => {
        commit('setFreeListingStatus', json);
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.log(error);
        Promise.reject(new Error(error));
      });
  },

  getLastSync({commit}) {
    fetch('')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((json) => {
        commit('setLastSync', json);
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.log(error);
        Promise.reject(new Error(error));
      });
  },

  registerSync({commit}, payload) {
    fetch('', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(payload),
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
      .then((json) => {
        commit('setRegisterDataSync', json);
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.log(error);
        Promise.reject(new Error(error));
      });
  },

  suspendSync({commit}, payload) {
    fetch('', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(payload),
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
      .then((json) => {
        commit('setSuspendSync', json);
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.log(error);
        Promise.reject(new Error(error));
      });
  },

};
