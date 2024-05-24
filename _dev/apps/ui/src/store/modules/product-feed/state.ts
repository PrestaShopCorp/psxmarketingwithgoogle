import {DeliveryDetail, ShopShippingInterface} from '@/providers/shipping-settings-provider';
import attributesToMap from './attributes-to-map.json';
import {AttributeResponseFromAPI} from '@/utils/AttributeMapping';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {CustomCarrier} from '@/providers/shipping-rate-provider';
import {RateType} from '@/enums/product-feed/rate';
import Categories, {SelectedProductCategories} from '@/enums/product-feed/attribute-mapping-categories';
import {IncrementalSyncContext} from '@/components/product-feed-page/dashboard/feed-configuration/feed-configuration';
import {RequestState} from '@/store/types';
import {ProductIssueImpact} from '@/components/render-issues/types';
import {
  BrandOption, CategoryOption, CleanProductFilter, Feature,
} from '@/components/product-feed/settings/product-selection/type';
import ProductFilterMethodsSynch from '@/enums/product-feed/product-filter-methods-synch';
import ProductFeedCountStatus from '@/enums/product-feed/product-feed-count-status';

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

export type VerificationStats = Pick<
  ProductFeedReport,
  'productsInCatalog' | 'invalidProducts' | 'validProducts'
>;

export type ProductFeedReport = {
  lastConfigurationUsed: IncrementalSyncContext|null;
  productsInCatalog: string|null;
  invalidProducts: number|null;
  validProducts: number|null;
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
  productFilter: CleanProductFilter[];
}
export interface ProductFeedValidationSummary {
  activeProducts: number|null;
  expiringProducts: number|null;
  pendingProducts: number|null;
  disapprovedProducts: number|null;
}
export interface ProductInfos {
 id: string;
 title: string;
 impacts: ProductIssueImpact[],
 issues?: ProductInfosIssues[];
 destinations?: string[];
}

export interface ProductInfosIssues {
  title: string;
  destination: string;
  code: string;
  affectedProperty: string;
  countries: string[];
  advice: string;
  documentationLink: string;
  status: ProductStatus;
}

export type GmcProductsByStatusRequest = {
  numberOfProductsPerPage: number;
  offsets: GmcProductsByStatusRequestOffset;
}

export type GmcProductsByStatusResults = {
  [key in ProductStatus]: ProductInfos[];
}

export type GmcProductsByStatusRequestOffset = {
  [key in ProductStatus]: number;
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

export interface ProductCount {
  count: number | null,
  status: ProductFeedCountStatus | null,
  abortController: AbortController | null,
}

export interface State {
  warmedUp: RequestState,
  isSyncSummaryLoadingInProgress: boolean;
  errorAPI: boolean;
  isConfigured: boolean;
  isConfiguredOnce: boolean;
  totalProducts: number;
  stepper: number;
  status: ProductFeedStatus;
  settings: ProductFeedSettings;
  validationSummary: ProductFeedValidationSummary;
  attributesToMap: any;
  attributesFromShop: Array<AttributesInfos>;
  selectedProductCategories: SelectedProductCategories;
  requestSynchronizationNow: boolean;
  attributeMapping: AttributeResponseFromAPI;
  report: ProductFeedReport;
  verificationIssues: ProductVerificationIssueOverall[]|null;
  verificationIssuesProducts: {
    [verificationIssue in ProductVerificationIssue]?: (ProductVerificationIssueProduct|null)[];
  },
  verificationIssuesNumberOfProducts: {
    [verificationIssue in ProductVerificationIssue]?: number;
  },

  gmcProductsByStatus: {
    request: GmcProductsByStatusRequest,
    results: GmcProductsByStatusResults,
    totalOfProducts: number|null,
  },
  productFilterOptions: {
    features: Feature[],
    categories: CategoryOption[],
    brands: BrandOption[],
  },
  productCount: ProductCount;
  syncSelected: ProductFilterMethodsSynch;
}

export enum ProductStatus {
  Disapproved = 'disapproved',
  Pending = 'pending',
  Approved = 'approved',
  Expiring = 'expiring',
}

export enum ProductVerificationIssue {
  MISSING_NAME = 'MISSING_NAME',
  MISSING_DESCRIPTION = 'MISSING_DESCRIPTION',
  MISSING_IMAGE = 'MISSING_IMAGE',
  MISSING_LINK = 'MISSING_LINK',
  MISSING_PRICE = 'MISSING_PRICE',
  MISSING_IDENTIFIER = 'MISSING_IDENTIFIER',
}

export enum ProductVerificationIssueTranslation {
  MISSING_NAME = 'nameMissing',
  MISSING_DESCRIPTION = 'descriptionMissing',
  MISSING_IMAGE = 'imageMissing',
  MISSING_LINK = 'linkMissing',
  MISSING_PRICE = 'priceMissing',
  MISSING_IDENTIFIER = 'identifierMissing',
}

export type ProductVerificationIssueOverall = {
  name: ProductVerificationIssue;
  affected: {
    [isoCodeLanguage: string]: number;
  };
}

export type ProductVerificationIssueProduct = {
  id: string,
  variationCount: string,
  name: string,
  langs: string[],
}

export const state: State = {
  warmedUp: RequestState.IDLE,
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
    productFilter: [],
  },
  productFilterOptions: {
    features: [],
    categories: [],
    brands: [],
  },
  productCount: {
    count: null,
    status: null,
    abortController: null,
  },
  syncSelected: ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT,
  validationSummary: {
    activeProducts: null,
    expiringProducts: null,
    pendingProducts: null,
    disapprovedProducts: null,
  },
  attributesToMap,
  requestSynchronizationNow: false,
  attributesFromShop: [],
  selectedProductCategories: [Categories.NONE],
  attributeMapping: {},
  report: {
    lastConfigurationUsed: null,
    productsInCatalog: null,
    invalidProducts: null,
    validProducts: null,
  },
  verificationIssues: null,
  verificationIssuesProducts: {},
  verificationIssuesNumberOfProducts: {},

  gmcProductsByStatus: {
    request: {
      numberOfProductsPerPage: 10,
      offsets: {
        [ProductStatus.Approved]: 0,
        [ProductStatus.Disapproved]: 0,
        [ProductStatus.Expiring]: 0,
        [ProductStatus.Pending]: 0,
      },
    },
    totalOfProducts: null,
    results: {
      [ProductStatus.Approved]: [],
      [ProductStatus.Disapproved]: [],
      [ProductStatus.Expiring]: [],
      [ProductStatus.Pending]: [],
    },
  },
};
