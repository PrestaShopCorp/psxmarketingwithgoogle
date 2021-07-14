import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import translations from '../../.storybook/translations.json';

let windowSpy, localVue;
  
beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
  
  windowSpy.mockImplementation(() => {
    return {
      i18nSettings: {
        isoCode: 'en',
      },
      translations,
    };
  });

  localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueRouter);
});

afterEach(() => {
  windowSpy.mockRestore();
});

export default localVue;
