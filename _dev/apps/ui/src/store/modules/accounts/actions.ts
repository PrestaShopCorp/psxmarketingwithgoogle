import {ActionContext} from 'vuex';
import {fetchOnboarding, HttpClientError} from 'mktg-with-google-common';
import {FullState} from '@/store/types';
import {GoogleConnectionStatus, State} from './state';
import ActionsTypes from './actions-types';
import MutationsTypes from './mutations-types';
import MutationsTypesProductFeed from '../product-feed/mutations-types';

type Context = ActionContext<State, FullState>;

export default {
  async [ActionsTypes.WARMUP_STORE]({dispatch, state}: Context) {
    if (state.warmedUp) {
      return;
    }
    state.warmedUp = true;
    await dispatch(ActionsTypes.REQUEST_GOOGLE_SETTINGS_STATUS);
    await dispatch(ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS);
  },

  async [ActionsTypes.REQUEST_GOOGLE_SETTINGS_STATUS]({commit}: Context) {
    try {
      const response = await fetchOnboarding('GET', 'settings/status');
      const settings = await response.json();
      commit(MutationsTypes.SET_GOOGLE_ACCOUNT, settings);

      return settings;
    } catch (error) {
      return null;
    }
  },

  async [ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH]({commit}: Context) {
    try {
      const response = await fetchOnboarding('GET', 'oauth/authorized-url');
      const json = await response.json();
      commit(MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL, json.authorizedUrl);
      return json.authorizedUrl;
    } catch (error) {
      commit(MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL, error);
      return null;
    }
  },

  async [ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS]({commit, dispatch}: Context) {
    try {
      const response = await fetchOnboarding('GET', 'oauth');
      const connection = await response.json() as GoogleConnectionStatus;
      commit(MutationsTypes.SET_GOOGLE_ACCOUNT, connection);

      if (connection.connected) {
        await dispatch(ActionsTypes.REQUEST_GMC_LIST);
      } else {
        await dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
      }
      return connection;
    } catch (error) {
      commit(MutationsTypes.SET_GOOGLE_ACCOUNT, null);
      await dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
      return null;
    }
  },

  async [ActionsTypes.REQUEST_GMC_LIST]({commit, dispatch, state}: Context) {
    try {
      const response = await fetchOnboarding('GET', 'merchant-accounts');
      const {accounts} = await response.json();
      commit(MutationsTypes.SAVE_GMC_LIST, accounts);

      if (state.googleAccount.merchantAccount) {
        const selected = accounts.find(
          (account) => account.id === state.googleAccount.merchantAccount,
        );

        if (selected) {
          commit(MutationsTypes.SAVE_GMC, selected);
          await dispatch(ActionsTypes.REQUEST_DATA_SOURCE_LIST);
        }
      }
      return accounts;
    } catch (error) {
      commit(
        MutationsTypes.SET_MERCHANT_SELECTION_ERROR,
        'LinkingFailed',
      );
      return [];
    }
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
    {commit, dispatch}: Context,
    payload,
  ) {
    const {selectedAccount} = payload;
    const response = await fetchOnboarding('POST', 'merchant-accounts/select', {
      body: {accountId: selectedAccount.id},
      onResponse: async (merchantResponse) => {
        if (!merchantResponse.ok) {
          commit(
            MutationsTypes.SET_MERCHANT_SELECTION_ERROR,
            'LinkingFailed',
          );
          throw new HttpClientError(merchantResponse.statusText, merchantResponse.status);
        }
        return merchantResponse;
      },
    });
    const {account} = await response.json();
    commit(MutationsTypes.SAVE_GMC, account);

    try {
      await dispatch(ActionsTypes.REQUEST_DATA_SOURCE_LIST);
    } catch (error) {
      commit(
        MutationsTypes.SET_MERCHANT_SELECTION_ERROR,
        'LinkingFailed',
      );
      throw error;
    }
    return account;
  },

  async [ActionsTypes.REQUEST_DATA_SOURCE_LIST]({commit, state}: Context) {
    const requestedAccount = state.googleAccount.merchantAccount;
    const response = await fetchOnboarding('GET', 'merchant-data-sources');
    const {dataSources} = await response.json();

    if (requestedAccount !== state.googleAccount.merchantAccount) {
      return [];
    }
    commit(MutationsTypes.SAVE_DATA_SOURCE_LIST, dataSources);
    return dataSources;
  },

  async [ActionsTypes.CREATE_DATA_SOURCE]({commit, state}: Context, payload) {
    const requestedAccount = state.googleAccount.merchantAccount;
    const response = await fetchOnboarding('POST', 'merchant-data-sources', {
      body: {
        feedLabel: payload.feedLabel,
        contentLanguage: payload.contentLanguage,
      },
    });
    const {dataSource} = await response.json();

    if (requestedAccount !== state.googleAccount.merchantAccount) {
      return null;
    }
    commit(MutationsTypes.SAVE_DATA_SOURCE, dataSource);
    return dataSource;
  },

  async [ActionsTypes.DISSOCIATE_GOOGLE_ACCOUNT]({commit, dispatch}: Context) {
    await fetchOnboarding('DELETE', 'oauth');
    commit(MutationsTypes.REMOVE_GMC);
    commit(MutationsTypes.SAVE_MCA_CONNECTED_ONCE, false);
    commit(
      `productFeed/${MutationsTypesProductFeed.TOGGLE_CONFIGURATION_FINISHED}`,
      false,
      {root: true},
    );
    commit(MutationsTypes.REMOVE_GOOGLE_ACCOUNT);
    commit(MutationsTypes.SET_GOOGLE_ACCOUNT, null);
    await dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
    return true;
  },
};
