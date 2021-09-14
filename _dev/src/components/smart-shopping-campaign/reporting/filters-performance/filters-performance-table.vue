<template>
  <div>
    <ReportingTableHeader
      :title="$t('campaigns.filtersPerformanceTable.title')"
      :subtitle="$t('campaigns.filtersPerformanceTable.subTitle')"
      start-date="04/06/2021"
      end-date="04/07/2021"
    />
    <b-table-simple
      id="table-filters-performance"
      class="ps_gs-table-products mb-3"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="({type, tooltip}, index) in fields"
            :key="type"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 0}"
          >
            <div class="flex align-items-center text-nowrap">
              <span>{{ $t(`campaigns.labelCol.${type}`) }}</span>
              <b-button
                v-if="tooltip"
                variant="invisible"
                v-b-tooltip:psxMktgWithGoogleApp
                :title="$t(`campaigns.tooltipCol.${type}`)"
                class="p-0 mt-0 ml-1 border-0 d-inline-flex align-items-center"
              >
                <i class="material-icons ps_gs-fz-14 text-secondary">error_outline</i>
              </b-button>
            </div>
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody class="bg-white">
        <FiltersPerformanceTableRow
          v-for="{
            name,
            productFilter,
            clicks,
            costs,
            averageCPC,
            conversions,
            conversionsRate,
            sales
          } in campaigns"
          :name="name"
          :product-filter="productFilter"
          :clicks="clicks"
          :costs="costs"
          :average-c-p-c="averageCPC"
          :conversions="conversions"
          :conversions-rate="conversionsRate"
          :sales="sales"
          :key="name"
        />
        <b-tr v-if="loading">
          <b-td
            colspan="7"
            class="ps_gs-table-products__loading-slot"
          >
            <i class="ps_gs-table-products__spinner">loading</i>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import StickyColumnsObserver from '@/utils/StickyColumnsObserver.ts';
import ReportingTableHeader from '../commons/reporting-table-header.vue';
import FiltersPerformanceTableRow from './filters-performance-table-row.vue';

export default {
  mixins: [StickyColumnsObserver],
  name: 'FiltersPerformanceTable',
  components: {
    ReportingTableHeader,
    FiltersPerformanceTableRow,
  },
  data() {
    return {
      loading: false,
      fields: [
        {
          type: 'campaign',
        },
        {
          type: 'productFilter',
        },
        {
          type: 'clicks',
        },
        {
          type: 'costs',
        },
        {
          type: 'averageCPC',
        },
        {
          type: 'conversions',
        },
        {
          type: 'conversionsRate',
        },
        {
          type: 'sales',
        },
      ],
      // TODO
      // Adds real datas
      campaigns: [
        {
          name: 'Promotion 1',
          productFilter: 'Brand',
          clicks: '0',
          costs: '$125',
          averageCPC: '$5',
          conversions: '127',
          conversionsRate: '127',
          sales: '$150',
        },
      ],
    };
  },
};
</script>
