<template>
  <div>
    <ReportingTableHeader
      :title="$t('campaigns.filtersPerformanceTable.title')"
      :subtitle="$t('campaigns.filtersPerformanceTable.subTitle')"
      :use-date="true"
    />
    <b-table-simple
      id="table-filters-performance"
      class="mb-3 ps_gs-table-products"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="(type, index) in partitionHeaderList"
            :key="type"
            class="font-weight-600"
            :class="{
              'b-table-sticky-column b-table-sticky-column--invisible': index === 0,
              'text-right': headerIsNumberType(type)
            }"
          >
            <div class="flex align-items-center text-nowrap">
              <b-button
                v-if="hasSorting(type)"
                @click="sortByType(type)"
                variant="invisible"
                class="p-0 border-0"
              >
                <span>{{ $t(`campaigns.labelCol.${type}`) }}</span>
                <template v-if="queryOrderDirection[type] === 'ASC'">
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
                v-if="hasToolTip(type)"
                variant="invisible"
                v-b-tooltip:psxMktgWithGoogleApp
                :title="$t(`campaigns.tooltipCol.${type}`)"
                class="p-0 mt-0 ml-1 border-0 d-inline-flex align-items-center"
              >
                <i class="material-icons ps_gs-fz-14 text-secondary">info_outlined</i>
              </b-button>
            </div>
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody class="bg-white">
        <template v-if="errorWithApi">
          <tr>
            <td :colspan="partitionHeaderList.length">
              <KeyMetricsErrorMessage />
            </td>
          </tr>
        </template>

        <template v-else>
          <ReportingTableEmptyMessage
            v-if="partitionList.length === 0"
            :colspan="partitionHeaderList.length"
            :text="$t('campaigns.filtersPerformanceTable.emptyListText')"
          />
          <FiltersPerformanceTableRow
            v-else
            v-for="(partition, key, index) in partitionList"
            :partition="partition"
            :key="index"
          />

          <b-tr v-if="loading">
            <b-td
              :colspan="partitionHeaderList.length"
              class="ps_gs-table-products__loading-slot"
            >
              <i class="ps_gs-table-products__spinner">loading</i>
            </b-td>
          </b-tr>
        </template>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import ReportingTableHeader from '../commons/reporting-table-header.vue';
import ReportingTableEmptyMessage from '../commons/reporting-table-empty-message.vue';
import FiltersPerformanceTableRow from './filters-performance-table-row.vue';
import ProductPartitionPerformanceHeaderType from '@/enums/reporting/ProductPartitionPerformanceHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import KeyMetricsErrorMessage from '../key-metrics/key-metrics-error-message.vue';

export default {
  name: 'FiltersPerformanceTable',
  components: {
    ReportingTableHeader,
    FiltersPerformanceTableRow,
    KeyMetricsErrorMessage,
    ReportingTableEmptyMessage,
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    headerIsNumberType(type) {
      return type === ProductPartitionPerformanceHeaderType.CLICKS
        || type === ProductPartitionPerformanceHeaderType.COSTS
        || type === ProductPartitionPerformanceHeaderType.AVERAGE_COST_PER_CLICK
        || type === ProductPartitionPerformanceHeaderType.CONVERSIONS
        || type === ProductPartitionPerformanceHeaderType.CONVERSIONS_RATE
        || type === ProductPartitionPerformanceHeaderType.SALES;
    },
    hasToolTip() {
      return false;
    },
    hasSorting(headerType) {
      return headerType === ProductPartitionPerformanceHeaderType.CLICKS;
    },
    sortByType(headerType) {
      // create new object for satisfy deep getter of vueJS
      const newOrderDirection = {...this.queryOrderDirection};

      if (this.queryOrderDirection[headerType] === QueryOrderDirection.ASCENDING) {
        newOrderDirection[headerType] = QueryOrderDirection.DESCENDING;
      } else {
        newOrderDirection[headerType] = QueryOrderDirection.ASCENDING;
      }
      this.queryOrderDirection = newOrderDirection;
    },
  },
  created() {
    this.fetchProductsPartitionsPerformances();
  },
  computed: {
    partitionHeaderList() {
      return Object.values(ProductPartitionPerformanceHeaderType);
    },
    partitionList() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES'];
    },
    errorWithApi() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES_SECTION_ERROR'];
    },
    queryOrderDirection: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES_ORDERING'];
      },
      set(orderDirection) {
        this.$store.commit('smartShoppingCampaigns/SET_REPORTING_PRODUCT_PARTITIONS_PERFORMANCES_ORDERING', orderDirection);
        this.fetchProductsPartitionsPerformances();
      },
    },
  },
  methods: {
    fetchProductsPartitionsPerformances() {
      this.loading = true;
      this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES')
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
