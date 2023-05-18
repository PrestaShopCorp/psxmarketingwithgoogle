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

import {content_v2_1 as contentApi} from '@googleapis/content/v2.1';
import {DeliveryDetail, ShopShippingInterface} from '@/providers/shipping-settings-provider';
import attributesToMap from './attributes-to-map.json';
import {AttributeResponseFromAPI} from '../../../utils/AttributeMapping';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {CustomCarrier} from '@/providers/shipping-rate-provider';
import {RateType} from '@/enums/product-feed/rate';
import Categories, {SelectedProductCategories} from '@/enums/product-feed/attribute-mapping-categories';
import {IncrementalSyncContext} from '@/components/product-feed-page/feed-configuration/feed-configuration';
import {VerificationStats} from '@/components/product-feed-page/verified-products/verified-products';

/**
 * @deprecated
 * To be replaced by ProductFeedReport
 */
export interface ProductFeedStatus {
  nextJobAt?: string;
  jobEndedAt?: string|null;
  lastUpdatedAt?: string|null;
  success: boolean;
  syncSchedule?: string;
}

export type ProductFeedReport = {
  lastConfigurationUsed: IncrementalSyncContext|null;
  verificationStats: VerificationStats;
}
export interface ProductFeedSettings {
  shippingSetup: ShippingSetupOption|null;
  estimateCarriers: CustomCarrier[];
  shippingSettings: ShopShippingInterface[];
  rate: RateType|null;
  deliveryDetails: DeliveryDetail[];
  autoImportTaxSettings: boolean;
  // Deprecated: Kept for backward compatibility with old product feed.
  autoImportShippingSettings?: boolean;
  targetCountries: string[]|null;
}
export interface ProductFeedValidationSummary {
  activeItems: number|null;
  expiringItems: number|null;
  pendingItems: number|null;
  disapprovedItems: number|null;
}
export interface PrevalidationScanSummary {
  scannedItems: number|null;
  invalidItems: number|null;
}
export interface ProductInfos {
 id: string;
 name: string;
 attribute: string;
 language: string;
 statuses: ProductInfosStatus[];
 issues?: contentApi.Schema$ProductStatusItemLevelIssue[];
}

export type ProductInfosStatus = {
  destination: string;
  status: ProductStatus;
  countries: string[];
}

export interface ProductsDatas {
  items: ProductInfos[];
}

export interface AttributesInfos {
  name: string[];
  displayName?: string;
  type: AttributesTypes;
}

export enum AttributesTypes {
  PRODUCT = 'product',
  CUSTOM = 'custom',
  FEATURE = 'feature',
}

export const commonAttributes: readonly AttributesInfos[] = [
  {
    name: ['ean'],
    type: AttributesTypes.PRODUCT,
  },
  {
    name: ['isbn'],
    type: AttributesTypes.PRODUCT,
  },
  {
    name: ['upc'],
    type: AttributesTypes.PRODUCT,
  },
  {
    name: ['mpn'],
    type: AttributesTypes.PRODUCT,
  },
  {
    name: ['description'],
    type: AttributesTypes.PRODUCT,
  },
  {
    name: ['description_short'],
    type: AttributesTypes.PRODUCT,
  },
  {
    name: ['manufacturer'],
    type: AttributesTypes.PRODUCT,
  },
];

export interface State {
  warmedUp: boolean,
  isSyncSummaryLoadingInProgress: boolean;
  errorAPI: boolean;
  isConfigured: boolean;
  isConfiguredOnce: boolean;
  totalProducts: number;
  stepper: number;
  status: ProductFeedStatus;
  settings: ProductFeedSettings;
  validationSummary: ProductFeedValidationSummary;
  prevalidationScanSummary: PrevalidationScanSummary;
  productsDatas: ProductsDatas;
  attributesToMap: any;
  attributesFromShop: Array<AttributesInfos>;
  selectedProductCategories: SelectedProductCategories;
  requestSynchronizationNow: boolean;
  preScanDetail: PreScanDetail;
  attributeMapping: AttributeResponseFromAPI;
  report: ProductFeedReport;
}

export enum ProductStatus {
  Disapproved = 'disapproved',
  Pending = 'pending',
  Approved = 'approved',
  Expiring = 'expiring',
}

export interface PreScanProductLang {
  title: string;
  lang: string;
}
export interface PreScanReporting {
  productId: number;
  attributeId?: number;
  lastValidationDate: number;
  titleByLang: PreScanProductLang[];
  isMissingName: Boolean;
  isMissingLink: Boolean;
  isMissingImage: Boolean;
  isMissingPrice: Boolean;
  isMissingDescription: Boolean;
  isMissingBrandOrBarcode: Boolean;
}
export interface PreScanDetail {
  products: PreScanReporting[];
  limit: number;
  currentPage: number;
  total: number;
  langChosen: string;
}

export const state: State = {
  warmedUp: false,
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
    syncSchedule: '',
  },
  settings: {
    shippingSetup: null,
    rate: null,
    estimateCarriers: [],
    shippingSettings: [],
    deliveryDetails: [],
    autoImportTaxSettings: false,
    targetCountries: null,
  },
  validationSummary: {
    activeItems: null,
    expiringItems: null,
    pendingItems: null,
    disapprovedItems: null,
  },
  prevalidationScanSummary: {
    scannedItems: null,
    invalidItems: null,
  },
  productsDatas: {
    items: [],
  },
  attributesToMap,
  requestSynchronizationNow: false,
  attributesFromShop: [],
  selectedProductCategories: [Categories.NONE],
  preScanDetail: {
    products: [],
    limit: 10,
    currentPage: 1,
    total: 0,
    langChosen: '',
  },
  attributeMapping: {},
  report: {
    lastConfigurationUsed: null,
    verificationStats: null,
  },
};
