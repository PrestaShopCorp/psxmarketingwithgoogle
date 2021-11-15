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

import {DeliveryDetail} from '../../../providers/shipping-settings-provider';
import attributesToMap from './attributes-to-map.json';

export interface ProductFeedStatus {
  nextJobAt?: string;
  jobEndedAt?: string|null;
  lastUpdatedAt?: string|null;
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
  shippingSettings: object[];
  deliveryDetails: DeliveryDetail[];
  autoImportTaxSettings: boolean;
  autoImportShippingSettings: boolean;
  attributeMapping: ProductFeedSettingsAttributeMapping;
  syncSchedule?: string;
}

export interface ProductFeedValidationSummary {
  activeItems: number|null;
  expiringItems: number|null;
  pendingItems: number|null;
  disapprovedItems: number|null;
}
export interface ProductInfos {
 id: string;
 name: string;
 attribute: string;
 issues? : Array<object>;
 statuses? : Array<object>;
}
export interface ProductsDatas {
  items: Array<ProductInfos>;
}

export interface AttributesInfos {
  name: string;
  displayName?: string;
  type: AttributesTypes;
}

export enum AttributesTypes {
  PRODUCT = 'product',
  CUSTOM = 'custom',
  FEATURE = 'feature',
}

export interface State {
  isSyncSummaryLoadingInProgress: boolean;
  errorAPI: boolean;
  isConfigured: boolean;
  isConfiguredOnce: boolean;
  totalProducts: number;
  stepper: number;
  status: ProductFeedStatus;
  settings: ProductFeedSettings;
  validationSummary : ProductFeedValidationSummary;
  productsDatas: ProductsDatas;
  attributesToMap: any;
  attributesData: Array<AttributesInfos>;
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
  totalProducts: 0,
  stepper: 1,
  status: {
    success: false,
    jobEndedAt: '',
    nextJobAt: '',
    lastUpdatedAt: '',
  },
  settings: {
    shippingSettings: [],
    deliveryDetails: [],
    autoImportTaxSettings: false,
    autoImportShippingSettings: true,
    attributeMapping: {
      exportProductsWithShortDescription: true,
      customColorAttribute: '',
      customSizeAttribute: '',
      customAgeGroupAttribute: '',
      customGenderGroupAttribute: '',
      customConditionAttribute: '',
    },
    syncSchedule: '1 * * * * *',
  },
  validationSummary: {
    activeItems: null,
    expiringItems: null,
    pendingItems: null,
    disapprovedItems: null,
  },
  productsDatas: {
    items: [],
  },
  attributesToMap,
  attributesData: [
    {
      name: 'ean13',
      type: AttributesTypes.PRODUCT,
    },
    {
      name: 'isbn',
      type: AttributesTypes.PRODUCT,
    },
    {
      name: 'upc',
      type: AttributesTypes.PRODUCT,
    },
    {
      name: 'mpn',
      type: AttributesTypes.PRODUCT,
    },
    {
      name: 'description',
      displayName: 'attributesMapping.description',
      type: AttributesTypes.PRODUCT,
    },
    {
      name: 'shortDescription',
      displayName: 'attributesMapping.shortDescription',
      type: AttributesTypes.PRODUCT,
    },
  ],
};
