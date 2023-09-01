import cloneDeep from 'lodash.clonedeep';
import GettersTypes from './getters-types';
import Getters from './getters';
import {DailyResultColor, State, state as originalState} from './state';
import KpiType from '@/enums/reporting/KpiType';

describe('Campaings getters', () => {
  describe(GettersTypes.GET_REPORTING_DAILY_RESULT_TYPES_AVAILABLE, () => {
    it('finds an available space', () => {
      const state: State = cloneDeep(originalState);
      const availableSpace = Getters.GET_REPORTING_DAILY_RESULT_TYPES_AVAILABLE(state);

      expect(availableSpace).toBe(true);
    });

    it('fails to find space when too many Kpis are selected', () => {
      const state: State = cloneDeep(originalState);
      state.reporting.request.dailyResultTypes = {
        [DailyResultColor.BLACK]: KpiType.IMPRESSIONS,
        [DailyResultColor.BLUE]: KpiType.SALES,
        [DailyResultColor.YELLOW]: KpiType.CONVERSIONS,
      };
      const availableSpace = Getters.GET_REPORTING_DAILY_RESULT_TYPES_AVAILABLE(state);

      expect(availableSpace).toBe(false);
    });
  });
});
