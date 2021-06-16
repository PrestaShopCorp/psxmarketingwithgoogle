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
  nextSync?: string,
  lastSync?: string;
  registerSyncData: any;
  failedSyncs: Array<string>;
  successfulSyncs: Array<string>;
  isSyncEnabled: boolean;
}
// ToDo: Update key name so you match the data coming from the API
export interface ProductFeedSettingsSellingApparel {
  color?: string;
  size?: string;
  age?: string;
  gender?: string;
}

export interface ProductFeedSettingsSellingRefurbished {
  condition?: string;
}

export interface ProductFeedSettings {
  autoImportTaxSettings: boolean;
  targetCountries: Array<string>;
  autoImportShippingSettings: boolean;
  exportProductsWithShortDescription: boolean;
  sellApparel: ProductFeedSettingsSellingApparel;
  sellRefurbished: ProductFeedSettingsSellingRefurbished,
}

export interface FreeListingStatus {
  validationList: any;
  summaryValidationList: any;
  status: any;
}
export interface State {
  productFeed: {
    isConfigured: boolean,
    stepper: number,
    status: ProductFeedStatus,
    settings: ProductFeedSettings,
  },
  freeListing: FreeListingStatus;
}

export const state: State = {
  productFeed: {
    isConfigured: false,
    stepper: 1,
    status: {
      failedSyncs: [],
      successfulSyncs: [],
      registerSyncData: {},
      isSyncEnabled: true,
    },
    settings: {
      autoImportTaxSettings: false,
      targetCountries: [],
      autoImportShippingSettings: false,
      exportProductsWithShortDescription: true,
      sellApparel: {
        color: 'extra:color',
        size: 'extra:size',
        age: 'extra:age-group',
        gender: 'extra:gender-group',
      },
      sellRefurbished: {
        condition: 'extra:condition',
      },
    },
  },
  freeListing: {
    validationList: {},
    summaryValidationList: [],
    status: false,
  },
};
