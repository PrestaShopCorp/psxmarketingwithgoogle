import createFetchMock from 'vitest-fetch-mock';
import {initOnboardingClient} from 'mktg-with-google-common/api/onboardingClient';
import actions from '@/store/modules/accounts/actions';
import ActionsTypes from '@/store/modules/accounts/actions-types';
import MutationsTypes from '@/store/modules/accounts/mutations-types';

import {} from '@/../tests/init';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

let commit;
let dispatch;
let payload;

const flushMicrotasks = async () => {
  for (let index = 0; index < 10; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve();
  }
};

beforeEach(() => {
  fetchMock.resetMocks();

  commit = vi.fn();
  dispatch = vi.fn();
  initOnboardingClient({
    apiUrl: 'https://admin.test/local-google-api',
  });
  payload = {
    selectedAccount: {
      id: '123',
      name: 'Tiny Lux',
    },
    correlationId: 'saucisse-id',
  };
});

describe('Action SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT', () => {
  it('should save selected google merchant account on success', async () => {
    fetchMock.mockResponse(JSON.stringify({account: payload.selectedAccount}));

    await actions[ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
      {
        dispatch,
        commit,
      },
      payload,
    );

    expect(commit).toHaveBeenCalledWith(MutationsTypes.SAVE_GMC, payload.selectedAccount);
    expect(dispatch).toHaveBeenCalledWith(ActionsTypes.REQUEST_DATA_SOURCE_LIST);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      method: 'POST',
      path: 'merchant-accounts/select',
      body: {accountId: '123'},
    });
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://admin.test/local-google-api');
    expect(fetchMock.mock.calls[0][1]?.headers).not.toHaveProperty('Authorization');
  });

  it('waits for the new account data sources and reports their failure deterministically', async () => {
    fetchMock.mockResponse(JSON.stringify({account: payload.selectedAccount}));
    let rejectDataSources;
    dispatch.mockImplementation((action) => {
      if (action === ActionsTypes.REQUEST_DATA_SOURCE_LIST) {
        return new Promise((resolve, reject) => {
          rejectDataSources = reject;
        });
      }
      return Promise.resolve();
    });
    let settled = false;
    const selection = actions[ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
      {dispatch, commit},
      payload,
    ).finally(() => {
      settled = true;
    });

    await flushMicrotasks();
    expect(dispatch).toHaveBeenCalledWith(ActionsTypes.REQUEST_DATA_SOURCE_LIST);
    expect(settled).toBe(false);
    rejectDataSources(new Error('data source lookup failed'));

    await expect(selection).rejects.toThrow('data source lookup failed');
    expect(commit).toHaveBeenCalledWith(
      MutationsTypes.SET_MERCHANT_SELECTION_ERROR,
      'LinkingFailed',
    );
  });

  it('warns when the GMC link fails ', async () => {
    fetchMock.mockResponse(JSON.stringify({message: 'oh no'}), {status: 401});

    try {
      await actions[ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
        {
          dispatch,
          commit,
        },
        payload,
      );
    } catch (e) {
      // Ignore
    }

    expect(commit).toHaveBeenCalledWith(
      MutationsTypes.SET_MERCHANT_SELECTION_ERROR, 'LinkingFailed');
    expect(commit).not.toHaveBeenCalledWith(MutationsTypes.SAVE_GMC, payload.selectedAccount);
  });
});

describe('Action REQUEST_GOOGLE_ACCOUNT_DETAILS', () => {
  it('restores local credential status before the OAuth connection lifecycle', async () => {
    const settings = {
      configured: true,
      clientIdSuffix: 'client-id',
      redirectUri: 'https://shop.test/oauth',
    };
    fetchMock.mockResponse(JSON.stringify(settings));

    const result = await actions[ActionsTypes.REQUEST_GOOGLE_SETTINGS_STATUS]({commit});

    expect(result).toEqual(settings);
    expect(commit).toHaveBeenCalledWith(MutationsTypes.SET_GOOGLE_ACCOUNT, settings);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      method: 'GET',
      path: 'settings/status',
      body: null,
    });
  });

  it('consumes the local connection status without requesting an unsupported merchant route', async () => {
    const connection = {
      connected: true,
      googleEmail: 'owner@example.com',
      merchantAccount: null,
      dataSource: null,
    };
    fetchMock.mockResponse(JSON.stringify(connection));

    const result = await actions[ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS]({
      commit,
      dispatch,
    });

    expect(result).toEqual(connection);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith(MutationsTypes.SET_GOOGLE_ACCOUNT, connection);
    expect(dispatch).toHaveBeenCalledWith(ActionsTypes.REQUEST_GMC_LIST);
    expect(dispatch).not.toHaveBeenCalledWith(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      method: 'GET',
      path: 'oauth',
      body: null,
    });
  });

  it('waits for the connected account list before resolving status warmup', async () => {
    const connection = {
      connected: true,
      googleEmail: 'owner@example.com',
      merchantAccount: '123',
      dataSource: null,
    };
    fetchMock.mockResponse(JSON.stringify(connection));
    let resolveAccounts;
    dispatch.mockImplementation((action) => {
      if (action === ActionsTypes.REQUEST_GMC_LIST) {
        return new Promise((resolve) => {
          resolveAccounts = resolve;
        });
      }
      return Promise.resolve();
    });
    let settled = false;
    const warmup = actions[ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS]({commit, dispatch})
      .finally(() => {
        settled = true;
      });

    await flushMicrotasks();
    expect(dispatch).toHaveBeenCalledWith(ActionsTypes.REQUEST_GMC_LIST);
    expect(settled).toBe(false);
    resolveAccounts([]);
    await warmup;
  });

  it('keeps the account disconnected and requests an authorization URL locally', async () => {
    const connection = {
      connected: false,
      googleEmail: null,
      merchantAccount: null,
      dataSource: null,
    };
    fetchMock.mockResponse(JSON.stringify(connection));

    const result = await actions[ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS]({
      commit,
      dispatch,
    });

    expect(result).toEqual(connection);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith(MutationsTypes.SET_GOOGLE_ACCOUNT, connection);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
    expect(dispatch).not.toHaveBeenCalledWith(ActionsTypes.REQUEST_GMC_LIST);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('Local Merchant account and data-source actions', () => {
  it('normalizes the wrapped local account list and restores the selected account', async () => {
    const accounts = [
      {id: '123', name: 'Tiny Lux'},
      {id: '456', name: 'Outlet'},
    ];
    fetchMock.mockResponse(JSON.stringify({accounts}));

    const result = await actions[ActionsTypes.REQUEST_GMC_LIST]({
      commit,
      dispatch,
      state: {
        googleAccount: {merchantAccount: '123'},
        googleMerchantAccount: {id: null},
      },
    });

    expect(result).toEqual(accounts);
    expect(commit).toHaveBeenCalledWith(MutationsTypes.SAVE_GMC_LIST, accounts);
    expect(commit).toHaveBeenCalledWith(MutationsTypes.SAVE_GMC, accounts[0]);
    expect(dispatch).toHaveBeenCalledWith(ActionsTypes.REQUEST_DATA_SOURCE_LIST);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      method: 'GET',
      path: 'merchant-accounts',
      body: null,
    });
  });

  it('waits for restored-account data sources before resolving the Merchant list', async () => {
    const accounts = [{id: '123', name: 'Tiny Lux'}];
    fetchMock.mockResponse(JSON.stringify({accounts}));
    let resolveDataSources;
    dispatch.mockImplementation((action) => {
      if (action === ActionsTypes.REQUEST_DATA_SOURCE_LIST) {
        return new Promise((resolve) => {
          resolveDataSources = resolve;
        });
      }
      return Promise.resolve();
    });
    let settled = false;
    const request = actions[ActionsTypes.REQUEST_GMC_LIST]({
      commit,
      dispatch,
      state: {
        googleAccount: {merchantAccount: '123'},
        googleMerchantAccount: {id: null},
      },
    }).finally(() => {
      settled = true;
    });

    await flushMicrotasks();
    expect(dispatch).toHaveBeenCalledWith(ActionsTypes.REQUEST_DATA_SOURCE_LIST);
    expect(settled).toBe(false);
    resolveDataSources([]);
    await expect(request).resolves.toEqual(accounts);
  });

  it('loads and creates API data sources through the local admin API only', async () => {
    const dataSource = {
      id: '456',
      name: 'accounts/123/dataSources/456',
      displayName: 'Tiny Lux PrestaShop API',
      input: 'API',
      primaryProductDataSource: {feedLabel: 'GB', contentLanguage: 'en'},
    };
    fetchMock
      .mockResponseOnce(JSON.stringify({dataSources: [dataSource]}))
      .mockResponseOnce(JSON.stringify({dataSource}));

    const listed = await actions[ActionsTypes.REQUEST_DATA_SOURCE_LIST]({
      commit,
      state: {googleAccount: {merchantAccount: '123'}},
    });
    const created = await actions[ActionsTypes.CREATE_DATA_SOURCE](
      {commit, state: {googleAccount: {merchantAccount: '123'}}},
      {feedLabel: 'GB', contentLanguage: 'en'},
    );

    expect(listed).toEqual([dataSource]);
    expect(created).toEqual(dataSource);
    expect(commit).toHaveBeenCalledWith(MutationsTypes.SAVE_DATA_SOURCE_LIST, [dataSource]);
    expect(commit).toHaveBeenCalledWith(MutationsTypes.SAVE_DATA_SOURCE, dataSource);
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({
      method: 'POST',
      path: 'merchant-data-sources',
      body: {feedLabel: 'GB', contentLanguage: 'en'},
    });
    fetchMock.mock.calls.forEach(([url, options]) => {
      expect(String(url)).toBe('https://admin.test/local-google-api');
      expect(options?.headers).not.toHaveProperty('Authorization');
      expect(String(options?.body)).not.toContain('access-token');
      expect(String(options?.body)).not.toContain('aggregator');
    });
  });

  it('ignores a late created data source after the selected Merchant account changes', async () => {
    const accountState = {googleAccount: {merchantAccount: '123'}};
    const dataSource = {
      id: '456',
      name: 'accounts/123/dataSources/456',
      displayName: 'Tiny Lux PrestaShop API',
      input: 'API',
      primaryProductDataSource: {feedLabel: 'GB', contentLanguage: 'en'},
    };
    let releaseResponse;
    const responseReady = new Promise((resolve) => {
      releaseResponse = resolve;
    });
    fetchMock.mockResponseOnce(async () => {
      await responseReady;

      return JSON.stringify({dataSource});
    });

    const creation = actions[ActionsTypes.CREATE_DATA_SOURCE](
      {commit, state: accountState},
      {feedLabel: 'GB', contentLanguage: 'en'},
    );
    await flushMicrotasks();
    accountState.googleAccount.merchantAccount = '999';
    releaseResponse();

    await expect(creation).resolves.toBeNull();
    expect(commit).not.toHaveBeenCalledWith(MutationsTypes.SAVE_DATA_SOURCE, dataSource);
  });
});
