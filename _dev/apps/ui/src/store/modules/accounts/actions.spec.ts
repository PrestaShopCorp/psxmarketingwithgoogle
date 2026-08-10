import createFetchMock from 'vitest-fetch-mock';
import {initOnboardingClient} from 'mktg-with-google-common/api/onboardingClient';
import actions from '@/store/modules/accounts/actions';
import ActionsTypes from '@/store/modules/accounts/actions-types';
import MutationsTypes from '@/store/modules/accounts/mutations-types';
import {WebsiteClaimErrorReason} from '@/store/modules/accounts/state';

import {} from '@/../tests/init';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

let commit;
let dispatch;
let payload;

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
      MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, WebsiteClaimErrorReason.LinkingFailed);
    expect(commit).not.toHaveBeenCalledWith(MutationsTypes.SAVE_GMC, payload.selectedAccount);
  });
});

describe('Action REQUEST_GOOGLE_ACCOUNT_DETAILS', () => {
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

    const listed = await actions[ActionsTypes.REQUEST_DATA_SOURCE_LIST]({commit});
    const created = await actions[ActionsTypes.CREATE_DATA_SOURCE](
      {commit},
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
});

describe('Action TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS', () => {
  it('short-circuits to the PendingUserInvitation override and skips claiming reads while the invite is unaccepted', async () => {
    const state = {googleMerchantAccount: {pendingUserInvitation: true}};

    await actions[ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS](
      {
        commit,
        dispatch,
        state,
        rootState: {app: {}},
      },
      'saucisse-id',
    );

    expect(commit).toHaveBeenCalledWith(
      MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
      WebsiteClaimErrorReason.PendingUserInvitation,
    );
    // Verify/claim reads 403 until the invite is accepted, so they must be gated
    // — instead we start polling for acceptance.
    expect(dispatch).toHaveBeenCalledWith(
      ActionsTypes.AWAIT_USER_INVITATION_ACCEPTANCE,
      'saucisse-id',
    );
    expect(dispatch).not.toHaveBeenCalledWith(
      ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS,
      'saucisse-id',
    );
  });
});

describe('Action AWAIT_USER_INVITATION_ACCEPTANCE', () => {
  it('resumes the claiming flow once the invite is accepted', async () => {
    // Invite already accepted (pendingUserInvitation cleared) -> no polling, just resume.
    const state = {googleMerchantAccount: {pendingUserInvitation: false}};
    const getters = {
      GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS:
        WebsiteClaimErrorReason.PendingUserInvitation,
    };

    await actions[ActionsTypes.AWAIT_USER_INVITATION_ACCEPTANCE](
      {dispatch, state, getters},
      'saucisse-id',
    );

    expect(dispatch).toHaveBeenCalledWith(
      ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS,
      'saucisse-id',
    );
    expect(dispatch).not.toHaveBeenCalledWith(ActionsTypes.REQUEST_NEW_GMC_DETAILS);
  });

  it('bails out without resuming when the claiming override is no longer pending-invitation', async () => {
    const state = {googleMerchantAccount: {pendingUserInvitation: true}};
    const getters = {
      GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS:
        WebsiteClaimErrorReason.PendingCheck,
    };

    await actions[ActionsTypes.AWAIT_USER_INVITATION_ACCEPTANCE](
      {dispatch, state, getters},
      'saucisse-id',
    );

    expect(dispatch).not.toHaveBeenCalled();
  });
});
