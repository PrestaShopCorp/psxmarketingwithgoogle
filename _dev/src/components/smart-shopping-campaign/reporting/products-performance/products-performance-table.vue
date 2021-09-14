<template>
  <div>
    <ReportingTableHeader
      :title="$t('campaigns.productsPerformanceTable.title')"
      :subtitle="$t('campaigns.productsPerformanceTable.subTitle')"
      start-date="04/06/2021"
      end-date="04/07/2021"
    />
    <b-table-simple
      id="table-products-performance"
      class="ps_gs-table-products mb-3"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="({type, tooltip, sorting}, index) in fields"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 1}"
            :key="type"
          >
            <div class="flex align-items-center text-nowrap">
              <b-button
                v-if="sorting"
                @click="sort()"
                variant="invisible"
                class="p-0 border-0"
              >
                <span>{{ $t(`campaigns.labelCol.${type}`) }}</span>
                <template v-if="sortDirection === 'asc'">
                  <i class="material-icons ps_gs-fz-14">expand_more</i>
                  <span class="sr-only">{{ $t('cta.clickToSortAsc') }}</span>
                </template>
                <template v-else>
                  <i class="material-icons ps_gs-fz-14">expand_less</i>
                  <span class="sr-only">{{ $t('cta.clickToSortDesc') }}</span>
                </template>
              </b-button>
              <span v-else>
                {{ $t(`campaigns.labelCol.${type}`) }}
              </span>
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
        <ProductsPerformanceTableRow
          v-for="{
            id,
            attribute,
            product,
            click,
            costs,
            averageCpc,
            conversions,
            conversionsRate,
            sales
          } in campaigns"
          :id="id"
          :attribute="attribute"
          :product="product"
          :click="click"
          :costs="costs"
          :average-cpc="averageCpc"
          :conversions="conversions"
          :conversions-rate="conversionsRate"
          :sales="sales"
          :key="id + attribute"
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
import ProductsPerformanceTableRow from './products-performance-table-row.vue';

export default {
  mixins: [StickyColumnsObserver],
  name: 'ProductsPerformanceTable',
  components: {
    ReportingTableHeader,
    ProductsPerformanceTableRow,
  },
  data() {
    return {
      sortDirection: 'asc',
      loading: false,
      fields: [
        {
          type: 'ID',
        },
        {
          type: 'product',
        },
        {
          type: 'click',
          sorting: true,
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
          id: '05',
          attribute: '01',
          product: 'T-shirt summer',
          click: '3678',
          costs: '$125',
          averageCpc: '$2',
          conversions: '5584',
          conversionsRate: '2%',
          sales: '$3182',
        },
        {
          id: '25',
          product: 'Super summer mug',
          click: '38',
          costs: '$125',
          averageCpc: '$5',
          conversions: '1874',
          conversionsRate: '5%',
          sales: '$1687',
        },
      ],
    };
  },
  methods: {
    // TODO: Handle sort function
    sort() {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        this.sortDirection = 'asc';
      }
    },
  },
};
</script>
