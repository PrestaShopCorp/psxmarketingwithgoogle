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
import Vue from "vue";

// import vue plugins
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import VueI18n from "vue-i18n";
import showdown from "showdown";
import VueShowdown from "vue-showdown";

// import css style
import "bootstrap-vue/dist/bootstrap-vue";
import "prestakit/dist/css/bootstrap-prestashop-ui-kit.css";
import "!style-loader!css-loader!sass-loader!../src/assets/scss/app.scss";

/**
 * ? Should this extension be in it's on file?
 * Showdown Extension to allow target attribute on links in MD
 * Eslint is disabled because I wasn't sure how to correct the regex fn
 */
/* eslint-disable */
showdown.extension("targetlink", function () {
  return [
    {
      type: "lang",
      regex: /\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)\{\:target=(["'])(.*?)\6}/g,
      replace: function (wholematch, linkText, url, a, b, title, c, target) {
        var result = '<a href="' + url + '"';

        if (typeof title != "undefined" && title !== "" && title !== null) {
          title = title.replace(/"/g, "&quot;");
          title = showdown.helper.escapeCharacters(title, "*_", false);
          result += ' title="' + title + '"';
        }

        if (typeof target != "undefined" && target !== "" && target !== null) {
          result += ' target="' + target + '"';
        }

        result += ">" + linkText + "</a>";
        return result;
      },
    },
  ];
});
/* eslint-enable */

Vue.use(BootstrapVue, BootstrapVueIcons);
Vue.use(VueShowdown);

// i18n and store
Vue.use(VueI18n);
addDecorator(() => ({
  template: "<story/>",
  i18n: new VueI18n({
    locale: "en",
    messages: require("./translations.json"),
  }),
  store: require("../src/store"),
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
        'Base',
        'LandingPage',
          [
            'Components',
              ['Header', 'Content', 'Footer'] ,
            'LandingPage'
          ],
        'Onboarding',
          [
            'Components',
              ['SectionTitle', 'Notice - Product feed', 'Card - PS Account', 'Card - Google Account', 'Card - MCA', 'Card - Product feed', 'Card - Free listing', 'Settings - Poduct feed'] ,
            'OnboardingPage',
              ['Header', 'Content', 'Footer'] ,
          ],
      ]
    }
  }
};
export const decorators = [
  () => ({ template: '<div id="googleShoppingApp"><story /></div>' }),
];
