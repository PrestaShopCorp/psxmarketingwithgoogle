import {config, createLocalVue} from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import translations from '../.storybook/translations.json'; 

let windowSpy; let
  localVue;
const defaultLocale = 'en';

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');

  windowSpy.mockImplementation(() => ({
    // add data needed in window
  }));

  localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueRouter);
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

export const commonOptions = {
  localVue,
};

export { cloneStore } from './store';

export default commonOptions;
