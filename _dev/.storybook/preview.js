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
import { addDecorator } from '@storybook/vue';
import { select } from '@storybook/addon-knobs';
import Vue from 'vue';
import Vuex from 'vuex';

// import vue plugins
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import VueShowdown from 'vue-showdown';

// import jest
import { withTests } from '@storybook/addon-jest';

// import showdown extension
import '../showdown.js';
import '../src/utils/Filters';

// import css style
// theme.css v1.7.5 from the Back-Office
// all font import are commented to avoid 404
import '!style-loader!css-loader?url=false!./assets/theme.css';
// shame.css is a set of rules to better mimic the BO behavior in a shameful way
import '!style-loader!css-loader?url=false!./assets/shame.css';
// app.scss all the styles for the module
import '!style-loader!css-loader!sass-loader!../src/assets/scss/app.scss';

// Test utils
import {cloneStore} from '@/../tests/store';
import {initialStateApp} from "../.storybook/mock/state-app";

// jest results file
import results from '../.jest-test-results.json';
import VueRouter from 'vue-router';

Vue.use(BootstrapVue, BootstrapVueIcons);
Vue.use(VueShowdown);
Vue.use(VueRouter);

// import language file
const messages = require('./translations.json');
const locales = Object.keys(messages);

// i18n and store
Vue.use(VueI18n);
Vue.use(Vuex);

addDecorator((story, context) => ({
  template: context.parameters.component === "OnboardingPage" ?
  `
    <div
      class='nobootstrap'
      style='
        background: none;
        padding: 0;
        min-width: 0;
    '>
      <div id='psxMktgWithGoogleApp'>
        <story />
      </div>
    </div>
    `
    :
    `
    <div
      class='nobootstrap'
      style='
        background: none;
        padding: 0;
        min-width: 0;
    '>
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
    `
    ,
  i18n: new VueI18n({
    defaultLocale: 'en',
    locale: 'en',
    locales,
    messages,
  }),
  // add a props to toggle language
  props: {
    storybookLocale: {
      type: String,
      default: select('I18n locale', locales, 'en'),
    },
  },
  watch: {
    // add a watcher to toggle language
    storybookLocale: {
      handler() {
        this.$i18n.locale = this.storybookLocale;
        let dir = this.storybookLocale === 'ar' ? 'rtl' : 'ltr';
        document.querySelector('html').setAttribute('dir', dir);
      },
      immediate: true,
    },
  },
  beforeCreate() {
    window.i18nSettings = {
      languageLocale: 'en', // needed in _dev/src/store/modules/product-feed/actions.ts
      languageCode: 'en-US', // needed in _dev/src/store/modules/product-feed/actions.ts
      isoCode: 'en',
    }

    this.$store.state.app = Object.assign({}, initialStateApp);
  },
  store: new Vuex.Store(cloneStore()),
  router: new VueRouter(),
}));

addDecorator(
  withTests({
    results,
  })
);

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
        'Smart Shopping Campaign',
        'Product Feed Page',
        'Reporting',
        ['Key Metrics'],
        'Basic Components',
      ],
    },
  },
};
