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

export interface State {
  campaignName: String;
  campaignDurationDate: CampaignDuration;
  targetCountry: String;
  productCampaign: Array<any>;
  campaignBudget: String;
  tracking: null|boolean;
  tagAlreadyExists: boolean;
  reporting: Reporting;
}

export interface CampaignDuration {
  startedAt: String;
  endedAt: String|null;
}

export interface Reporting {
  request: RequestParams;
  results: ResultsRequest;
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
  productsPartitionsPerformancesSection: ProductsPartitionsPerformancesSection;
}
export interface DateRange {
  periodSelected: ReportingPeriod;
  startDate: string;
  endDate: string;
}

export interface Orderings {
  campaignsPerformances: {
    order: OrderByType;
  },
  productsPerformances: {
    order: OrderByType;
  },
  productsDimensionsPerformances: {
    order: OrderByType;
  }
}

export interface OrderByType {
  clicks: QueryOrderDirection,
}

export interface Kpis {
  impressions: number;
  clicks: number;
  conversions: number;
  averageCostPerClick: number;
  costs: number;
  sales: number;
}

export interface DailyresultChart {
  dailyResultList: Array<DailyResult>;
}

export interface CampaignsPerformancesSection {
  campaignsPerformanceList: Array<CampaignPerformances>;
  nextPageToken: string;
}

export interface ProductsPerformancesSection {
  productsPerformanceList: Array<ProductPerformances>,
}

export interface ProductsPartitionsPerformancesSection {
  productsPartitionsPerformanceList: Array<ProductPartitionPerformances>;
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

export interface ProductPartitionPerformances {
  campaignName: string,
  dimension: string,
  dimensionValue: string,
  clicks: number,
  costs: number,
  averageCostPerClick: number,
  conversions: number,
  conversionsRate: number,
  sales: number
}

export const state: State = {
  campaignName: '',
  campaignDurationDate: {
    startedAt: '',
    endedAt: '',
  },
  targetCountry: '',
  productCampaign: [],
  campaignBudget: '',
  tracking: null,
  tagAlreadyExists: false,
  reporting: {
    request: {
      dateRange: {
        periodSelected: ReportingPeriod.YESTERDAY,
        startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      },
      dailyResultType: KpiType.IMPRESSIONS,
      ordering: {
        campaignsPerformances: {
          order: {
            clicks: QueryOrderDirection.ASCENDING,
          },
        },
        productsPerformances: {
          order: {
            clicks: QueryOrderDirection.ASCENDING,
          },
        },
        productsDimensionsPerformances: {
          order: {
            clicks: QueryOrderDirection.ASCENDING,
          },
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
        nextPageToken: '',
      },
      productsPerformancesSection: {
        productsPerformanceList: [],
      },
      productsPartitionsPerformancesSection: {
        productsPartitionsPerformanceList: [],
      },
    },
  },
};
