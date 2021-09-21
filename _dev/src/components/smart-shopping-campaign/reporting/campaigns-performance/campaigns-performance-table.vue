<template>
  <div>
    <ReportingTableHeader
      :title="$t('campaigns.campaignsPerformanceTable.title')"
      :subtitle="$t('campaigns.campaignsPerformanceTable.subTitle')"
      :start-date="reportingStartDate"
      :end-date="reportingEndDate"
    />
    <b-table-simple
      id="table-campaigns-performance"
      class="mb-3 ps_gs-table-products table-overflow-selector"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="(type, index) in campaignHeaderList"
            :key="type"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 0}"
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
      <b-tbody
        class="bg-white"
        id="campaigns-table-body"
        ref="campaigns-table-body"
      >
        <CampaignsPerformanceTableRow
          v-for="(campaign, key, index) in campaignList"
          :campaign="campaign"
          :key="index"
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
import CampaignsPerformanceTableRow from './campaigns-performance-table-row.vue';
import CampaignPerformanceHeaderType from '@/enums/reporting/CampaignPerformanceHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';

export default {
  mixins: [StickyColumnsObserver],
  name: 'CampaignsPerformanceTable',
  components: {
    ReportingTableHeader,
    CampaignsPerformanceTableRow,
  },
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    const tableBody = document.getElementsByClassName('table-overflow-selector')[0];
    tableBody.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    hasToolTip(headerType) {
      return headerType === CampaignPerformanceHeaderType.STATUS;
    },
    hasSorting(headerType) {
      return headerType === CampaignPerformanceHeaderType.CLICKS;
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
    async handleScroll() {
      const tableBody = document.getElementsByClassName('table-overflow-selector')[0];
      const token = await this.$store.getters['smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_TOKEN'];

      if (
        tableBody.scrollTop >= tableBody.scrollHeight - tableBody.clientHeight
        && token !== null
      ) {
        this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES');
      }
    },
  },
  computed: {
    reportingStartDate() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_FORMATTED_START_DATES'];
    },
    reportingEndDate() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_FORMATTED_END_DATES'];
    },
    campaignHeaderList() {
      return Object.values(CampaignPerformanceHeaderType);
    },
    campaignList() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES'];
    },
    queryOrderDirection: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING'];
      },
      set(orderDirection) {
        this.$store.commit('smartShoppingCampaigns/RESET_REPORTING_CAMPAIGNS_PERFORMANCES');
        this.$store.commit('smartShoppingCampaigns/SET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING', orderDirection);
        this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES');
      },
    },
  },
};
</script>

<style scoped lang="scss">
.table-overflow-selector {
  height: 350px;
  overflow: hidden scroll;
}
</style>
