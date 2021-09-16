import {config, createLocalVue} from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import translations from '../.storybook/translations.json';

let windowSpy;
let localVue; // eslint-disable-line 
const defaultLocale = 'en';
let filters; // eslint-disable-line 

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');
  windowSpy.mockImplementation(() => ({
    // add data needed in window
  }));
  localVue = createLocalVue();
  localVue.use(Vuex);
  filters = {
    timeConverterToDate: jest.fn(),
    timeConverterToHour: jest.fn(),
    changeCountriesCodesToNames: jest.fn().mockImplementation(() => []),
  };

  localVue.filter('timeConverterToDate', filters.timeConverterToDate);
  localVue.filter('timeConverterToHour', filters.timeConverterToHour);
  localVue.filter('changeCountriesCodesToNames', filters.changeCountriesCodesToNames);
});

afterEach(() => {
  windowSpy.mockRestore();
});

config.mocks.$t = (key) => {
  const parts = key.split('.');
  const {length} = parts;
  let property = translations[defaultLocale];

  for (let i = 0; i < length; i += 1) {
    property = property[parts[i]];
  }

  return property;
};
config.mocks.$i18n = {
  t: config.mocks.$t,
};
export default {config};

export {cloneStore} from './store';

export {localVue, filters};
