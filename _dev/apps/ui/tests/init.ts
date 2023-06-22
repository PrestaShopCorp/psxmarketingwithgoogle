import {config, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import {BootstrapVue} from 'bootstrap-vue';
import VueShowdown from 'vue-showdown';
import {initOnboardingClient} from 'mktg-with-google-common/api/onboardingClient';
import {initShopClient} from 'mktg-with-google-common/api/shopClient';
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
    removeEventListener: jest.fn(),
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

  initOnboardingClient({
    apiUrl: 'http://some-route',
    token: 'some-token',
  });
  initShopClient({
    shopUrl: 'http://some-route',
  });
});

afterEach(() => {
  jest.resetAllMocks();
  windowSpy.mockRestore();
});

const mockedi18n = (key) => {
  const parts = key.split('.');
  const {length} = parts;
  let property = messages[defaultLocale];

  for (let i = 0; i < length && property; i += 1) {
    property = property[parts[i]];
  }

  return property || key;
};

config.mocks.$t = mockedi18n;

config.mocks.$tc = mockedi18n;

config.mocks.$te = mockedi18n;

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
