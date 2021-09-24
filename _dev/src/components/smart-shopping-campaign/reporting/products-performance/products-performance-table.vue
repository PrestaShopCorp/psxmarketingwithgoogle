<template>
  <div>
    <ReportingTableHeader
      :title="$t('campaigns.productsPerformanceTable.title')"
      :subtitle="$t('campaigns.productsPerformanceTable.subTitle')"
      :use-date="true"
    />
    <b-table-simple
      id="table-products-performance"
      class="mb-3 ps_gs-table-products"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="(type, index) in campaignHeaderList"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 1}"
            :key="type"
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
                <i class="material-icons ps_gs-fz-14 text-secondary">error_outline</i>
              </b-button>
            </div>
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody class="bg-white">
        <tr v-if="errorWithApi">
          <td :colspan="campaignHeaderList.length">
            <KeyMetricsErrorMessage />
          </td>
        </tr>
        <ReportingTableEmptyMessage
          v-if="!errorWithApi && !loading && campaignList.length === 0"
          :colspan="campaignHeaderList.length"
          :text="$t('campaigns.productsPerformanceTable.emptyListText')"
        />
        <ProductsPerformanceTableRow
          v-else
          v-for="(campaign, key, index) in campaignList"
          :campaign="campaign"
          :key="index"
        />
        <b-tr v-if="loading">
          <b-td
            :colspan="campaignHeaderList.length"
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
import ReportingTableHeader from '../commons/reporting-table-header.vue';
import ReportingTableEmptyMessage from '../commons/reporting-table-empty-message.vue';
import ProductsPerformanceTableRow from './products-performance-table-row.vue';
import ProductPerformanceHeaderType from '@/enums/reporting/ProductPerformanceHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import KeyMetricsErrorMessage from '../key-metrics/key-metrics-error-message.vue';
import ActionsTypes from '@/store/modules/smart-shopping-campaigns/actions-types';
import MutationsTypes from '@/store/modules/smart-shopping-campaigns/mutations-types';

export default {
  name: 'ProductsPerformanceTable',
  components: {
    ReportingTableHeader,
    ReportingTableEmptyMessage,
    ProductsPerformanceTableRow,
    KeyMetricsErrorMessage,
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.$store.subscribeAction((action) => {
      if (action.type.split('/').pop() === ActionsTypes.GET_REPORTING_PRODUCTS_PERFORMANCES) {
        this.loading = true;
      }
    });

    this.$store.subscribe((mutation) => {
      if (mutation.type.split('/').pop() === MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES) {
        this.loading = false;
      }
    });
  },
  methods: {
    hasToolTip() {
      return false;
    },
    hasSorting(headerType) {
      return headerType === ProductPerformanceHeaderType.CLICKS;
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
  computed: {
    campaignHeaderList() {
      return Object.values(ProductPerformanceHeaderType);
    },
    campaignList() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PERFORMANCES'];
    },
    errorWithApi() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PERFORMANCES_SECTION_ERROR'];
    },
    queryOrderDirection: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PERFORMANCES_ORDERING'];
      },
      set(orderDirection) {
        this.$store.commit('smartShoppingCampaigns/SET_REPORTING_PRODUCT_PERFORMANCES_ORDERING', orderDirection);
        this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_PRODUCTS_PERFORMANCES');
      },
    },
  },
};
</script>
