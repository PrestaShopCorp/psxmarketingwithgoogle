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

export interface ProductFeedStatus {
  nextJobAt?: string;
  jobEndedAt?: string|null;
  success: boolean;
  syncSchedule?: string;
}
export interface ProductFeedSettingsAttributeMapping {
  exportProductsWithShortDescription?: boolean;
  customColorAttribute?: string;
  customSizeAttribute?: string;
  customAgeGroupAttribute?: string;
  customGenderGroupAttribute?: string;
  customConditionAttribute?: string;
}

export interface ProductFeedSettings {
  shippingSettings: Array<object>;
  autoImportTaxSettings: boolean;
  targetCountries: Array<string> | null;
  autoImportShippingSettings: boolean;
  attributeMapping: ProductFeedSettingsAttributeMapping;
  syncSchedule?: string;
}

export interface ProductFeedValidationSummary {
  activeItems: number|null,
  expiringItems: number|null,
  pendingItems: number|null,
  disapprovedItems: number|null,
}

export interface State {
  isSyncSummaryLoadingInProgress: boolean,
  errorAPI: boolean
  isConfigured: boolean,
  isConfiguredOnce: boolean,
  psxMtgWithGoogleActiveShopCountry: Array<string>,
  totalProducts: number,
  stepper: number,
  status: ProductFeedStatus,
  settings: ProductFeedSettings,
  validationSummary : ProductFeedValidationSummary,
}

export enum ProductStatues {
  Disapproved = 'disapproved',
  Pending = 'pending',
  Approved = 'approved',
}

export const state: State = {
  isSyncSummaryLoadingInProgress: false,
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
  psxMtgWithGoogleActiveShopCountry: [],
  totalProducts: 0,
  stepper: 1,
  status: {
    success: false,
    jobEndedAt: '',
    nextJobAt: '',
  },
  settings: {
    shippingSettings: [],
    autoImportTaxSettings: false,
    targetCountries: null,
    autoImportShippingSettings: true,
    attributeMapping: {},
    syncSchedule: '1 * * * * *',
  },
  validationSummary: {
    activeItems: null,
    expiringItems: null,
    pendingItems: null,
    disapprovedItems: null,
  },
};
