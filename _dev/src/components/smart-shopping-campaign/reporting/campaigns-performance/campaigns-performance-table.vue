<template>
  <div>
    <ReportingTableHeader
      :title="$t('campaigns.campaignsPerformanceTable.title')"
      :subtitle="$t('campaigns.campaignsPerformanceTable.subTitle')"
      :use-date="true"
    />
    <b-table-simple
      id="table-campaigns-performance"
      class="mb-3 ps_gs-table-products table-with-maxheight b-table-sticky-header"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="(type, index) in campaignHeaderList"
            :key="type"
            class="font-weight-600 bg-prestashop-bg"
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
      <b-tbody
        class="bg-white"
        id="campaigns-table-body"
        ref="campaigns-table-body"
      >
        <template v-if="errorWithApi">
          <tr>
            <td :colspan="campaignHeaderList.length">
              <KeyMetricsErrorMessage />
            </td>
          </tr>
        </template>
        <template v-else>
          <ReportingTableEmptyMessage
            v-if="!loading && campaignList.length === 0"
            :colspan="campaignHeaderList.length"
            :text="$t('campaigns.campaignsPerformanceTable.emptyListText')"
            :cta="createCampaign"
          />

          <CampaignsPerformanceTableRow
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
        </template>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import ReportingTableHeader from '../commons/reporting-table-header.vue';
import ReportingTableEmptyMessage from '../commons/reporting-table-empty-message.vue';
import CampaignsPerformanceTableRow from './campaigns-performance-table-row.vue';
import CampaignPerformanceHeaderType from '@/enums/reporting/CampaignPerformanceHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import KeyMetricsErrorMessage from '../key-metrics/key-metrics-error-message.vue';
import TablePageControls from '../../../commons/table-page-controls.vue';

export default {
  name: 'CampaignsPerformanceTable',
  components: {
    ReportingTableHeader,
    ReportingTableEmptyMessage,
    CampaignsPerformanceTableRow,
    KeyMetricsErrorMessage,
    TablePageControls,
  },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    const tableBody = document.getElementsByClassName('table-with-maxheight')[0];

    if (tableBody) {
      tableBody.addEventListener('scroll', this.handleScroll);
    }

    this.fetchCampaigns();
  },
  beforeDestroy() {
    const tableBody = document.getElementsByClassName('table-with-maxheight')[0];

    if (tableBody) {
      tableBody.removeEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    headerIsNumberType(type) {
      return type === CampaignPerformanceHeaderType.BUDGET
        || type === CampaignPerformanceHeaderType.IMPRESSIONS
        || type === CampaignPerformanceHeaderType.CLICKS
        || type === CampaignPerformanceHeaderType.AD_SPEND
        || type === CampaignPerformanceHeaderType.CONVERSIONS
        || type === CampaignPerformanceHeaderType.SALES;
    },
    fetchCampaigns(isNewRequest = true) {
      this.loading = true;
      this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES', isNewRequest)
        .finally(() => {
          this.loading = false;
        });
    },
    createCampaign() {
      this.$router.push({
        name: 'campaign-creation',
      });
    },
    hasToolTip(headerType) {
      return headerType === false;
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
      const body = document.getElementsByClassName('table-with-maxheight')[0];
      const token = await this.$store.getters['smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_TOKEN'];

      if (body.scrollTop >= body.scrollHeight - body.clientHeight && token !== null) {
        await this.fetchCampaigns(false);
      }
    },
  },
  computed: {
    campaignHeaderList() {
      return Object.values(CampaignPerformanceHeaderType);
    },
    campaignList() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES'];
    },
    errorWithApi() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES_SECTION_ERROR'];
    },
    queryOrderDirection: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING'];
      },
      set(orderDirection) {
        this.$store.commit('smartShoppingCampaigns/SET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING', orderDirection);
        this.fetchCampaigns();
      },
    },
  },
};
</script>
