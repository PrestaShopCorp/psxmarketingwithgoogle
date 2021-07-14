import { config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import translations from '../../.storybook/translations.json';

let windowSpy, localVue;
const defaultLocale = 'en';

beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get");
    
    windowSpy.mockImplementation(() => {
        return {
            // add data needed in window
        };
    });
    
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
});

afterEach(() => {
  windowSpy.mockRestore();
});

config.mocks.$t = key => {
    const parts = key.split( "." ),
        length = parts.length;
    let property = translations[defaultLocale];

    for (let i = 0; i < length; i++ ) {
        property = property[parts[i]];
    }

    return property;
};

export default {
    commonOptions: {
        localVue,
    }
};
