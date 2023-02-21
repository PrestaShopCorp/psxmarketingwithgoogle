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
module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'prestashop',
    'plugin:vue/strongly-recommended',
    '@vue/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': ['error', {props: false}],
    'import/no-extraneous-dependencies': ['error', {devDependencies: ['**/*.spec.ts', '**/tests/*.ts']}],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // To enable later, this has been disabled to ease the migration
    // to the latest versions of our dependencies
    'vue/no-mutating-props': 'off',
  },
};
