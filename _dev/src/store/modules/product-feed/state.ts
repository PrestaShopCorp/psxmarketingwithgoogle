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
  nextSync: string,
  lastSync: string;
  registerSyncData: any;
  isSuspendSync: any;
}

export interface ProductFeedSettingsSellingApparel {
  color: any;
  size: any;
  age: any;
  gender: any;
}
export interface ProductFeedSettingsStatus {
  autoImportTaxSettings: boolean;
  targetCountries: Array<string>;
  autoImportShippingSettings: boolean;
  exportProductsWithShortDescription: boolean;
  sellApparel: ProductFeedSettingsSellingApparel;
  sellRefurbished: any
}

export interface FreeListingStatus {
  validationList: any;
  summaryValidationList: any;
  status: any;
}
export interface State {
  productFeed: {
    stepper: number,
    status: ProductFeedStatus,
    settings: ProductFeedSettingsStatus,
  },
  freeListing: FreeListingStatus;
}

export const state: State = {
  productFeed: {
    stepper: 1,
    status: {
      nextSync: '',
      lastSync: '',
      registerSyncData: {},
      isSuspendSync: null,
    },
    settings: {
      autoImportTaxSettings: false,
      targetCountries: [],
      autoImportShippingSettings: false,
      exportProductsWithShortDescription: true,
      sellApparel: {
        color: '',
        size: '',
        age: '',
        gender: '',
      },
      sellRefurbished: [],
    },
  },
  freeListing: {
    validationList: {},
    summaryValidationList: [],
    status: false,
  },
};
