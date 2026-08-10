import cloneDeep from 'lodash.clonedeep';
import mutations from '@/store/modules/accounts/mutations';
import MutationsTypes from '@/store/modules/accounts/mutations-types';
import {state as initialState} from '@/store/modules/accounts/state';

describe('accounts mutations', () => {
  it('clears the selected data source synchronously when the Merchant account changes', () => {
    const state = cloneDeep(initialState);
    state.googleMerchantAccount.id = '123';
    state.googleAccount.merchantAccount = '123';
    state.googleAccount.dataSource = 'accounts/123/dataSources/456';
    state.merchantDataSources = [{
      id: '456',
      name: 'accounts/123/dataSources/456',
      displayName: 'Tiny Lux PrestaShop API',
      input: 'API',
    }];

    mutations[MutationsTypes.SAVE_GMC](state, {id: '999', name: 'Outlet'});

    expect(state.googleAccount.merchantAccount).toBe('999');
    expect(state.googleAccount.dataSource).toBeNull();
    expect(state.merchantDataSources).toEqual([]);
  });
});
