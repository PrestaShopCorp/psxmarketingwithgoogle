import fetchMock from 'jest-fetch-mock';
import actions from '@/store/modules/accounts/actions';
import ActionsTypes from '@/store/modules/accounts/actions-types';
import MutationsTypes from '@/store/modules/accounts/mutations-types';
import {WebsiteClaimErrorReason} from '@/store/modules/accounts/state';

import {} from '@/../tests/init';

fetchMock.enableMocks();

let commit;
let dispatch;
let rootState;
let state;
let payload;

beforeEach(() => {
  fetchMock.resetMocks();

  commit = jest.fn();
  dispatch = jest.fn();
  rootState = {
    app: {
      psxMktgWithGoogleApiUrl: 'http://perdu.com',
    },
  };
  state = {
    tokenPsAccounts: 'token',
  };
  payload = {
    selectedAccount: {
      aggregatorId: '1',
      id: '1',
    },
    correlationId: 'saucisse-id',
  };
});

describe('Action SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT', () => {
  it('should save selected google merchant account on success', async () => {
    fetchMock.mockResponse(JSON.stringify({message: 'User linked'}));

    await actions[ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
      {
        dispatch,
        commit,
        rootState,
        state,
      },
      payload,
    );

    expect(commit).toHaveBeenCalledWith(MutationsTypes.SAVE_GMC, payload.selectedAccount);
  });

  it('warns when the GMC link fails ', async () => {
    fetchMock.mockResponse(JSON.stringify({message: 'oh no'}), {status: 401});

    try {
      await actions[ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
        {
          commit,
          rootState,
          state,
          dispatch,
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
