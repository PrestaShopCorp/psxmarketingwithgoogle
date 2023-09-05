import cloneDeep from 'lodash.clonedeep';
import ActionsTypes from './actions-types';
import MutationsTypes from './mutations-types';
import {DailyResultColor, State, state as originalState} from './state';
import actions from './actions';
import KpiType from '@/enums/reporting/KpiType';

describe('Campaigns actions', () => {
  describe(ActionsTypes.ADD_REPORTING_DAILY_RESULTS_TYPE, () => {
    it('assigns a new color when possible', () => {
      const state: State = cloneDeep(originalState);
      const commit = vi.fn();

      const passed = actions.ADD_REPORTING_DAILY_RESULTS_TYPE(
        {commit, state},
        KpiType.CLICKS,
      );

      expect(passed).toBe(true);
      expect(commit).toBeCalledTimes(1);
      expect(commit).toBeCalledWith(
        MutationsTypes.SET_REPORTING_DAILY_RESULTS_TYPES,
        {
          [DailyResultColor.BLACK]: KpiType.IMPRESSIONS,
          [DailyResultColor.BLUE]: KpiType.CLICKS,
          [DailyResultColor.YELLOW]: null,
        });
    });

    it('ignores when a type is already set', () => {
      const state: State = cloneDeep(originalState);
      const commit = vi.fn();

      const passed = actions.ADD_REPORTING_DAILY_RESULTS_TYPE(
        {commit, state},
        KpiType.IMPRESSIONS,
      );

      expect(passed).toBe(true);
      expect(commit).toBeCalledTimes(0);
    });

    it('fails when the list is already full', () => {
      const state: State = cloneDeep(originalState);
      state.reporting.request.dailyResultTypes = {
        [DailyResultColor.BLACK]: KpiType.IMPRESSIONS,
        [DailyResultColor.BLUE]: KpiType.CONVERSIONS,
        [DailyResultColor.YELLOW]: KpiType.COSTS,
      };
      const commit = vi.fn();

      const passed = actions.ADD_REPORTING_DAILY_RESULTS_TYPE(
        {commit, state},
        KpiType.SALES,
      );

      expect(passed).toBe(false);
      expect(commit).toBeCalledTimes(0);
    });
  });

  describe(ActionsTypes.REMOVE_REPORTING_DAILY_RESULTS_TYPE, () => {
    it('removes an existing key', () => {
      const state: State = cloneDeep(originalState);
      const commit = vi.fn();

      actions.REMOVE_REPORTING_DAILY_RESULTS_TYPE(
        {state, commit},
        KpiType.IMPRESSIONS,
      );

      expect(commit).toBeCalledTimes(1);
      expect(commit).toBeCalledWith(
        MutationsTypes.SET_REPORTING_DAILY_RESULTS_TYPES,
        {
          [DailyResultColor.BLACK]: null,
          [DailyResultColor.BLUE]: null,
          [DailyResultColor.YELLOW]: null,
        });
    });

    it('does nothing when a key is not set', () => {
      const state: State = cloneDeep(originalState);
      const commit = vi.fn();

      actions.REMOVE_REPORTING_DAILY_RESULTS_TYPE(
        {state, commit},
        KpiType.SALES,
      );

      expect(commit).toBeCalledTimes(0);
    });
  });
});
