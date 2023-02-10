import {config, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import {BootstrapVue} from 'bootstrap-vue';
import VueShowdown from 'vue-showdown';
import {messages} from '@/lib/translations';
import {changeCountriesCodesToNames} from '@/utils/Countries';
import '../showdown.js';

let windowSpy;
let localVue; // eslint-disable-line
const defaultLocale = 'en';
let filters; // eslint-disable-line
let VBTooltip;

beforeAll(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);
});

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');
  windowSpy.mockImplementation(() => ({
    // add data needed in window
    scrollTo: jest.fn(),
    addEventListener: jest.fn(),
    i18nSettings: {isoCode: 'fr', languageLocale: 'fr'},
  }));
  VBTooltip = jest.fn();
  filters = {
    timeConverterToDate: jest.fn(),
    timeConverterToHour: jest.fn(),
    changeCountriesCodesToNames: jest.fn().mockImplementation(changeCountriesCodesToNames),
    timeConverterToStringifiedDate: jest.fn().mockImplementation(() => ''),
    slugify: jest.fn().mockImplementation(() => 'foo'),
  };

  localVue.filter('timeConverterToDate', filters.timeConverterToDate);
  localVue.filter('timeConverterToHour', filters.timeConverterToHour);
  localVue.filter('changeCountriesCodesToNames', filters.changeCountriesCodesToNames);
  localVue.filter('timeConverterToStringifiedDate', filters.timeConverterToStringifiedDate);
  localVue.filter('slugify', filters.slugify);
  localVue.directive('b-tooltip', VBTooltip);
});

afterEach(() => {
  jest.resetAllMocks();
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

config.mocks.$te = (key) => {
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

config.mocks.fetch = {

};
export default {config};

export {cloneStore} from './store';

export {localVue, filters};

export const addShowdownToVue = () => {
  localVue.use(VueShowdown);
};

export const addBootstrapToVue = () => {
  localVue.use(BootstrapVue);
};
