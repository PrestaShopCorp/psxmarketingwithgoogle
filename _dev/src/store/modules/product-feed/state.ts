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

// ToDo: Replace every "any" in this file with the proper type
export interface ProductFeedStatus {
  nextJobAt?: string,
  jobEndedAt?: string;
  shopHealthy: boolean;
  failedSyncs: Array<string>;
  successfulSyncs: Array<string>;
  enabled: boolean;
}
export interface ProductFeedSettingsAttributeMapping {
  customColorAttribute?: string;
  customSizeAttribute?: string;
  customAgeGroupAttribute?: string;
  customGenderGroupAttribute?: string;
  customConditionAttribute?: string;
}

export interface ProductFeedSettings {
  autoImportTaxSettings: boolean;
  targetCountries: Array<string>;
  productsPerBatchSync: number;
  autoImportShippingSettings: boolean;
  exportProductsWithShortDescription: boolean;
  attributeMapping: ProductFeedSettingsAttributeMapping;
}

export interface State {
    isConfigured: boolean,
    stepper: number,
    status: ProductFeedStatus,
    settings: ProductFeedSettings,
}

export const state: State = {
  isConfigured: false,
  stepper: 1,
  status: {
    failedSyncs: [],
    successfulSyncs: [],
    enabled: false,
    shopHealthy: true,
  },
  settings: {
    autoImportTaxSettings: false,
    targetCountries: [],
    productsPerBatchSync: 0,
    autoImportShippingSettings: true,
    exportProductsWithShortDescription: true,
    attributeMapping: {},
  },
};
