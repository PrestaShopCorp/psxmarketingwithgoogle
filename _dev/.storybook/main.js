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
 const path = require('path');

 module.exports = {
   "stories": [
     "../stories/**/*.stories.mdx",
     "../stories/**/*.stories.@(js|jsx|ts|tsx)"
   ],
   "addons": [
     "@storybook/addon-links",
     "@storybook/addon-essentials",
   ],
   webpackFinal: async (config) => {
     config.module.rules.push({
       test: /\.scss$/,
       use: ['style-loader', 'css-loader', 'sass-loader'],
       include: path.resolve(__dirname, '../'),
     });
     config.resolve.alias = {
       ...config.resolve.alias,
       '@': path.resolve(__dirname, '../src/'),
     };
     return config;
   },
 }
