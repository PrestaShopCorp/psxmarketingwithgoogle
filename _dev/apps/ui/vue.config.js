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
  chainWebpack: (config) => {
    config.plugins.delete('html');
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.compilerOptions.modules = [
          {
            preTransformNode(astEl) {
              if (process.env.NODE_ENV === 'production') {
                const {attrsMap, attrsList} = astEl;

                if (attrsMap['data-test-id']) {
                  delete attrsMap['data-test-id'];
                  const index = attrsList.findIndex((x) => x.name === 'data-test-id');
                  attrsList.splice(index, 1);
                }
              }
              return astEl;
            },
          },
        ];
        return options;
      });
  },
  css: {
    extract: false,
  },
  runtimeCompiler: true,
  productionSourceMap: !!process.env.GENERATE_SOURCEMAPS,
  filenameHashing: false,
  outputDir: '../../../views/',
  assetsDir: '',
  publicPath: process.env.VUE_APP_ASSETS_URL || '../modules/psxmarketingwithgoogle/views/',
};
