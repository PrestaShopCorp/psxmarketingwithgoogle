import {config, createLocalVue} from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import {messages} from '@/lib/translations';

let windowSpy;
let localVue; // eslint-disable-line
const defaultLocale = 'en';
let filters; // eslint-disable-line

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');
  windowSpy.mockImplementation(() => ({
    // add data needed in window
    scrollTo: jest.fn(),
  }));
  localVue = createLocalVue();
  localVue.use(Vuex);

  filters = {
    timeConverterToDate: jest.fn(),
    timeConverterToHour: jest.fn(),
    changeCountriesCodesToNames: jest.fn().mockImplementation(() => []),
    timeConverterToStringifiedDate: jest.fn().mockImplementation(() => ''),
  };

  localVue.filter('timeConverterToDate', filters.timeConverterToDate);
  localVue.filter('timeConverterToHour', filters.timeConverterToHour);
  localVue.filter('changeCountriesCodesToNames', filters.changeCountriesCodesToNames);
  localVue.filter('timeConverterToStringifiedDate', filters.timeConverterToStringifiedDate);
});

afterEach(() => {
  windowSpy.mockRestore();
});

config.mocks.$t = (key) => {
  const parts = key.split('.');
  const {length} = parts;
  let property = messages[defaultLocale];

  for (let i = 0; i < length; i += 1) {
    property = property[parts[i]];
  }

  return property;
};

config.mocks.$tc = (key) => {
  const parts = key.split('.');
  const {length} = parts;
  let property = messages[defaultLocale];

  for (let i = 0; i < length; i += 1) {
    property = property[parts[i]];
  }

  return property;
};

config.mocks.$segment = {
  track: () => null,
};

config.mocks.$i18n = {
  t: config.mocks.$t,
  tc: config.mocks.$tc,
};
export default {config};

export {cloneStore} from './store';

export {localVue, filters};
