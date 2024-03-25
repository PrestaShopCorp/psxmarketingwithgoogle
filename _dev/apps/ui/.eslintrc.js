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
    es2022: true,
  },
  extends: [
    'prestashop',
    'plugin:vue/strongly-recommended',
    '@vue/typescript',
  ],
  rules: {
    'max-len': ['warn', {code: 80}],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': ['error', {props: false}],
    'import/no-extraneous-dependencies': ['error', {devDependencies: ['**/*.spec.ts', '**/tests/*.ts', '**/*.stories.ts']}],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // Need some help to handle this error
    'no-restricted-exports': 'off',
  },
};
