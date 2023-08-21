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

import dayjs from 'dayjs';
import KpiType from '@/enums/reporting/KpiType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';
import CampaignStatus, {CampaignStatusToggle, CampaignTypes} from '@/enums/reporting/CampaignStatus';

export interface State {
  warmedUp: boolean,
  campaigns: CampaignObject[],
  campaignsOrdering: CampaignsOrdering,
  nextPageTokenCampaignList: null|string;
  errorCampaignNameExists: null|boolean;
  tracking: null|boolean;
  tagAlreadyExists: boolean;
  conversionActions: ConversionAction[];
  reporting: Reporting;
  // All possible dimensions & filters (untouched by the popin, not filtered by any search)
  sscAvailableFilters: Dimension[];
  errorFetchingFilters: boolean;
  // Dimension selected in the popin
  dimensionChosen: Dimension,
  // Selected dimensions and filters formatted for the API (after validation from the popin)
  filtersChosen: FiltersChosen[];
}

export interface ConversionAction {
  category: string,
  tag: string,
}
export interface FiltersChosen {
  dimension?: string,
  values?: Array<string>,
}
export interface Dimension {
  // Data from API
  name?: string;
  subtitle?: string;
  id?: string;
  numberOfProductsAssociated?: number,
  children?: Dimension[];
  status?: string,
  countryCode?: string,
  languageCode?: string,

  // Managed by this app
  checked?: boolean;
  indeterminate?: boolean;
  visible?: boolean;
}
export interface CampaignsOrdering {
  name?: string,
  duration?: QueryOrderDirection,
 }

export interface ProductsFilteredObject {
  dimension: string,
  values: string[]
}

export interface CampaignStatusPayload {
  id: number,
  status: CampaignStatusToggle,
}
export type CampaignObject = {
  id: number;
  campaignName: string;
  startDate: string;
  endDate?: string;
  targetCountry: string;
  dailyBudget : number;
  currencyCode: string;
  productFilters?: ProductsFilteredObject[];
  status?: CampaignStatus|CampaignStatusToggle;
  hasUnhandledFilters?: boolean;
  type: CampaignTypes;

  impressions: number;
  clicks: number;
  adSpend: number;
  conversions: number;
  sales: number;
}

export interface Reporting {
  request: RequestParams;
  results: ResultsRequest;
  errorsList: ReportingErrorList;
}

export interface ReportingErrorList {
  kpis: boolean;
  campaignsPerformancesSection: boolean;
  productsPerformancesSection: boolean;
  filtersPerformancesSection: boolean;
}

export interface RequestParams {
  dateRange: DateRange;
  dailyResultType: KpiType;
  ordering: Orderings;
}

export interface ResultsRequest {
  kpis: Kpis;
  dailyResultChart: DailyresultChart;
  campaignsPerformancesSection: CampaignsPerformancesSection;
  productsPerformancesSection: ProductsPerformancesSection;
  filtersPerformancesSection: FiltersPerformancesSection;
}
export interface DateRange {
  periodSelected: ReportingPeriod;
  startDate: string;
  endDate: string;
}

export interface Orderings {
  campaignsPerformances: OrderByType;
  productsPerformances: OrderByType;
  filtersPerformances: OrderByType;
}

export interface OrderByType {
  clicks?: QueryOrderDirection,
  name?: string,
  startDate?: QueryOrderDirection,
}

export interface Kpis {
  impressions: number;
  clicks: number;
  conversions: number;
  averageCostPerClick: number;
  costs: number;
  sales: number;
  date?: string;
}

export interface DailyresultChart {
  dailyResultList: Array<DailyResult>;
}

export interface CampaignsPerformancesSection {
  campaignsPerformanceList: CampaignPerformances[];
  limitCampaignPerformanceList: number;
  activePage: number,
  totalCampaigns: number,
}

export interface ProductsPerformancesSection {
  productsPerformanceList: Array<ProductPerformances>,
}

export interface FiltersPerformancesSection {
  productsPartitionsPerformanceList: Array<FiltersPerformances>;
}

export interface DailyResult {
  impressions: number,
  clicks: number,
  conversions: number,
  averageCostPerClick: number,
  costs: number,
  sales: number,
  date: string;
}

export interface CampaignPerformances {
  name: string;
  budget: number;
  status: string;
  impressions: number;
  clicks: number;
  adSpend: number;
  conversions: number;
  sales: number;
  type: CampaignTypes;
}

export interface ProductPerformances {
  id: string,
  name: string,
  clicks: number,
  costs: number,
  averageCostPerClick: number,
  conversions: number,
  conversionsRate: number,
  sales: number
}

export interface FiltersPerformances {
  campaignName: string,
  dimension: string,
  productFilter: string,
  clicks: number,
  costs: number,
  averageCostPerClick: number,
  conversions: number,
  conversionsRate: number,
  sales: number
}

export const state: State = {
  warmedUp: false,
  campaigns: [],
  campaignsOrdering: {},
  nextPageTokenCampaignList: null,
  errorCampaignNameExists: null,
  tracking: true,
  tagAlreadyExists: false,
  conversionActions: [],
  sscAvailableFilters: [],
  errorFetchingFilters: false,
  dimensionChosen: {},
  filtersChosen: [],
  reporting: {
    request: {
      dateRange: {
        periodSelected: ReportingPeriod.YESTERDAY,
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      },
      dailyResultType: KpiType.IMPRESSIONS,
      ordering: {
        campaignsPerformances: {
          clicks: QueryOrderDirection.DESCENDING,
        },
        productsPerformances: {
          clicks: QueryOrderDirection.DESCENDING,
        },
        filtersPerformances: {
          clicks: QueryOrderDirection.DESCENDING,
        },
      },
    },
    results: {
      kpis: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        averageCostPerClick: 0,
        costs: 0,
        sales: 0,
      },
      dailyResultChart: {
        dailyResultList: [],
      },
      campaignsPerformancesSection: {
        campaignsPerformanceList: [],
        limitCampaignPerformanceList: 10,
        activePage: 1,
        totalCampaigns: 0,
      },
      productsPerformancesSection: {
        productsPerformanceList: [],
      },
      filtersPerformancesSection: {
        productsPartitionsPerformanceList: [],
      },
    },
    errorsList: {
      kpis: false,
      campaignsPerformancesSection: false,
      productsPerformancesSection: false,
      filtersPerformancesSection: false,
    },
  },
};
