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
          <ProductsPerformanceTableHeading
            v-for="({type, tooltip}, index) in fields"
            :type="type"
            :tooltip="tooltip"
            :index="index"
            :key="type"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 1}"
          />
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
import ProductsPerformanceTableHeading from './products-performance-table-heading.vue';
import ProductsPerformanceTableRow from './products-performance-table-row.vue';

export default {
  mixins: [StickyColumnsObserver],
  name: 'ProductsPerformanceTable',
  components: {
    ReportingTableHeader,
    ProductsPerformanceTableHeading,
    ProductsPerformanceTableRow,
  },
  data() {
    return {
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
};
</script>
