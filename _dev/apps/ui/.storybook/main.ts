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

import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ["../**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-controls",
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    // FIX ME: After migrating on Storybook 7,
    // findTestRestult was failing with "import_upath.normalize is not a function"
    // "@storybook/addon-jest",
  ],
  staticDirs: ['./assets'],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  async viteFinal(config) {
    // An alias is automatically added by Storybook to use a specifc runner of Vue
    // It sets a file to the vue library, while we need @vue/compat, that's why we rewrite it here.
    config.resolve.alias[0] = {
      find: 'vue',
      // TODO: Find a better vue runtime
      replacement: '@vue/compat/dist/vue.cjs.js',
      // replacement: '@vue/compat/dist/vue.esm-bundler.js',
    };
    console.log(config.resolve?.alias);
    // process.exit();
    // Merge custom configuration into the default config
    return mergeConfig(config, {
    });
  },
  docs: {
    autodocs: false,
  },
};

export default config;
