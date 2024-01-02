/**
 * 2007-2021 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

import Vue, { defineComponent } from 'vue';
import Vuex from 'vuex';
import {initShopClient} from "mktg-with-google-common/api/shopClient";
import {initOnboardingClient} from "mktg-with-google-common/api/onboardingClient";
import {useGlobals} from '@storybook/client-api';

// import vue plugins
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import VueShowdown from 'vue-showdown';
import VueSegment from '@/lib/segment';
import i18n, {availableLocales, loadLanguageAsync} from '@/lib/i18n.ts';

// Test utils
import {cloneStore} from '@/../tests/store';
import {initialStateApp} from "../.storybook/mock/state-app";

import { initialize, mswDecorator } from 'msw-storybook-addon';
// Initialize MSW
initialize({
  serviceWorker: {
    // Points to the custom location of the Service Worker file.
    url: './mockServiceWorker.js'
  },
  onUnhandledRequest: 'bypass',
});

// import showdown extension
import '../showdown.js';

 // app.scss all the styles for the module
 import '../src/assets/scss/app.scss';

 // jest results file
 import results from '../.jest-test-results.json';
 import VueRouter from 'vue-router';
 import router from '@/router';

 Vue.config.ignoredElements = ['prestashop-accounts'];
 Vue.use(BootstrapVue, BootstrapVueIcons);
 Vue.use(VueShowdown);
 Vue.use(VueRouter);

 // i18n and store
 Vue.use(VueI18n);
 Vue.use(Vuex);
 Vue.use(VueSegment, {
  id: 'dummyID',
  debug: true,
  pageCategory: '[GGL]',
});

export const decorators = [
  (story, context) => {
    const [{storybookLocale}] = useGlobals();
    loadLanguageAsync(storybookLocale);

    return defineComponent({
      template: 
        `
        <div>
        <div
          id="header_infos"
          style="display:none;"
        >
        </div>
        <div
          class='nobootstrap'
          id="content"
          style='
            background: none;
            padding: 0;
            min-width: 0;
        '>
          <div class="page-head">
          </div>
          <div id='psxMktgWithGoogleApp'>
            <div class='ps_gs-sticky-head'>
              <b-toaster
                name='b-toaster-top-right'
                class='ps_gs-toaster-top-right'
              />
            </div>
            <story />
          </div>
        </div>
        </div>`,
      data() {
        return {
          storybookLocale,
        }
      },
      i18n,
      beforeCreate() {
        window.i18nSettings = {
          languageLocale: 'en-us', // needed in _dev/apps/ui/src/store/modules/product-feed/actions.ts
          isoCode: 'en',
        }
  
        this.$store.state.app = Object.assign({}, initialStateApp);
        this.$root.identifySegment = () => {};
        initShopClient({shopUrl: '/'});
        initOnboardingClient({token: 'token', apiUrl: `${window.location.protocol}//${window.location.host}`});
      },
      store: new Vuex.Store(cloneStore()),
      router,
    });
  },
  // TODO: Bring back once issue with @storybook/addon-jest is fixed
  // withTests({results}),
  mswDecorator,
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'backOffice',
    values: [
      {
        name: 'backOffice',
        value: '#F1F1F1',
      },
      {
        name: 'white',
        value: '#ffffff',
      },
      {
        name: 'black',
        value: '#000000',
      },
    ],
  },
  chromatic: {
    delay: 500,
    diffThreshold: 0.15, // Test to see if we have less false positive
  },
  options: {
    storySort: {
      order: [
        'LandingPage',
        ['Components', ['Header', 'Content', 'Footer'], 'LandingPage'],
        'Onboarding',
        'Multistore',
        [
          'Components',
          [
            'SectionTitle',
            'Notice - Product feed',
            'Card - PS Account',
            'Card - Google Account',
            'Card - MCA',
            'Card - Product feed',
            'Card - Free listing',
            'Settings - Poduct feed',
          ],
          'OnboardingPage',
          ['Header', 'Content', 'Footer'],
        ],
        'PS Account',
        'Google Account',
        'Merchant Center Account',
        'Product feed',
        'Free listing',
        'Google Ads Account',
        'Product Feed Page',
        'Campaign',
        [
          'Card',
          'Tracking Card',
          'Campaigns\' list',
          'Form',
          'Popins',
        ],
        'Reporting',
        ['Key Metrics'],
        'Basic Components',
        'Whole application',
        ['Overview'],
      ],
    },
  },
};

export const globalTypes = {
  storybookLocale: {
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: availableLocales.map((languageLocale) => ({
        value: languageLocale,
        title: new Intl.DisplayNames(
            [navigator.language || 'en'],
            {type: 'language'},
          ).of(languageLocale),
        right: String.fromCodePoint(...(languageLocale === 'en' ? 'gb': languageLocale)
          .toUpperCase()
          .split('')
          .map(char =>  127397 + char.charCodeAt())),
      })),
    },
  },
};
