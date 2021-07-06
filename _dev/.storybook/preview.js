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
import { configure, addDecorator } from "@storybook/vue";
import { select } from '@storybook/addon-knobs'
import Vue from "vue";
import Vuex from "vuex";

// import vue plugins
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import VueI18n from "vue-i18n";
import VueShowdown from "vue-showdown";

// import showdown extension
import "../showdown.js";
import '../src/utils/Filters';

// import css style
// theme.css v1.7.5 from the Back-Office
// all font import are commented to avoid 404
import "!style-loader!css-loader?url=false!./assets/theme.css";
// shame.css is a set of rules to better mimic the BO behavior in a shameful way
import "!style-loader!css-loader?url=false!./assets/shame.css";
// app.scss all the styles for the module
import "!style-loader!css-loader!sass-loader!../src/assets/scss/app.scss";

Vue.use(BootstrapVue, BootstrapVueIcons);
Vue.use(VueShowdown);

// import language file
const message = require("./translations.json");

// i18n and store
Vue.use(VueI18n);

import store from "../src/store";
addDecorator(() => ({
  template: "<story/>",
  i18n: new VueI18n({
    defaultLocale: 'en',
    locale: 'en',
    locales: [ 'en', 'ar' ],
    messages: {
      en: message.en,
      ar: message.ar,
    },
  }),
  // add a props to toggle language
  props: {
    storybookLocale: {
      type: String,
      default: select('I18n locale', ['en', 'ar'], 'en'),
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
  store,
}));

configure(require.context("../src", true, /\.stories\.(ts|js|md)x?$/), module);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "backOffice",
    values: [
      {
        name: "backOffice",
        value: "#F1F1F1",
      },
      {
        name: "white",
        value: "#ffffff",
      },
      {
        name: "black",
        value: "#000000",
      },
    ],
  },
  options: {
    storySort: {
      order: [
        'LandingPage',
          [
            'Components',
              ['Header', 'Content', 'Footer'] ,
            'LandingPage'
          ],
        'Onboarding',
        'Multistore',
          [
            'Components',
              ['SectionTitle', 'Notice - Product feed', 'Card - PS Account', 'Card - Google Account', 'Card - MCA', 'Card - Product feed', 'Card - Free listing', 'Settings - Poduct feed'] ,
            'OnboardingPage',
              ['Header', 'Content', 'Footer'] ,
          ],
        'PS Account',
        'Google Account',
        'Merchant Center Account',
        'Product feed',
        'Free listing',
        'Google Ads Account',
        'Smart Shopping Campaign',
        'Product Feed Page',
        'Basic Components',
      ],
    },
  },
};
export const decorators = [
  () => ({
    template: `
      <div
        class="nobootstrap"
        style="
          background: none;
          padding: 0;
          min-width: 0;
        ">
        <div id="googleShoppingApp">
        <div class="ps_gs-sticky-head">
        <b-toaster
          name="b-toaster-top-right"
          class="ps_gs-toaster-top-right"
        />
      </div>
        <story /></div>
      </div>
      `
  }),
];
