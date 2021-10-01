<template>
  <div>
    <div class="d-flex flex-wrap flex-md-nowrap justify-content-between mb-md-3 rounded-top">
      <h3 class="order-2 order-md-1 ps_gs-fz-20 font-weight-600">
        {{ $t('smartShoppingCampaignList.tableTitle') }}
      </h3>
      <div
        class="order-1 order-md-2 ml-auto d-flex-md mr-md-0 mb-2 mt-n3 mt-md-0
        flex-md-shrink-0 text-center"
      >
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0"
          variant="outline-primary"
          @click="redirectToReporting"
        >
          {{ $t('cta.viewReporting') }}
        </b-button>
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 mr-md-0"
          variant="primary"
          @click="redirectToCreateCampaign"
        >
          {{ $t('cta.createCampaign') }}
        </b-button>
      </div>
    </div>
    <ReportingTableHeader
      :title="campaignList.length + ' campaign(s)'"
      :use-date="false"
    />
    <b-form-input
      id="campaign-name-input-filter"
      v-model="campaignName"
      :placeholder="$t('smartShoppingCampaignCreation.inputNamePlaceholder')"
      class="mt-2"
      @keyup="debounceName()"
    />
    <div>
      <b-table-simple
        id="table-filters-performance"
        class="ps_gs-table-products mb-0"
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
                  <template v-if="queryOrderDirection[type] === 'DESC'">
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
          <b-tr>
            <b-th
              v-for="(type, index) in campaignHeaderList"
              :key="type"
              class="font-weight-600"
              :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 0}"
            >
              <b-form-input
                type="text"
                :placeholder="$t('general.searchByX', [type])"
                size="sm"
                class="border-0"
                v-if="hasInput(type)"
                v-model="searchQuery[type]"
              />
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody class="bg-white">
          <template v-if="!loading">
            <SmartShoppingCampaignTableListRow
              v-for="campaign in campaignList"
              :key="campaign.campaignName"
              :campaign="campaign"
            />
          </template>
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
    <TablePageControls
      :next-page="tokenNextPage"
      @fetchNewCampaigns="fetchCampaigns({'nextPageToken': tokenNextPage})"
    />
  </div>
</template>

<script>
import SmartShoppingCampaignTableListRow from './smart-shopping-campaign-table-list-row.vue';
import ReportingTableHeader from './reporting/commons/reporting-table-header.vue';
import CampaignSummaryListHeaderType from '@/enums/campaigns-summary/CampaignSummaryListHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import TablePageControls from '../commons/table-page-controls.vue';

export default {
  name: 'SmartShoppingCampaignTableList',
  components: {
    SmartShoppingCampaignTableListRow,
    ReportingTableHeader,
    TablePageControls,
  },
  data() {
    return {
      campaignName: null,
      filters: {
        campaign: null,
        duration: 'ASC',
        status: null,
        target: null,
        product: null,
        budget: null,
      },
    };
  },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    campaignHeaderList() {
      return Object.values(CampaignSummaryListHeaderType);
    },
    campaignList() {
      const campaigns = this.$store.getters['smartShoppingCampaigns/GET_ALL_SSC'];
      const searchQuery = this.searchQuery[CampaignSummaryListHeaderType.CAMPAIGN];
      if (searchQuery) {
        return campaigns.filter((campaign) => {
          const nameMatch = campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
          return nameMatch;
        });
      }

      return campaigns;
    },
    tokenNextPage() {
      return this.$store.getters['smartShoppingCampaigns/GET_TOKEN_NEXT_PAGE_CAMPAIGN_LIST'];
    },
  },
  methods: {
    hasToolTip(headerType) {
      return headerType === CampaignSummaryListHeaderType.STATUS;
    },
    hasInput(headerType) {
      return headerType === CampaignSummaryListHeaderType.CAMPAIGN;
    },
    hasSorting(headerType) {
      return headerType === CampaignSummaryListHeaderType.DURATION;
    },
    redirectToCreateCampaign() {
      this.$router.push({
        name: 'campaign-creation',
      });
    },
    redirectToReporting() {
      this.$router.push({
        name: 'reporting',
      });
    },
    sortByType(headerType) {
      // create new object for satisfy deep getter of vueJS
      const newOrderDirection = {...this.filters};
      if (this.filters[headerType] === QueryOrderDirection.ASCENDING) {
        newOrderDirection[headerType] = QueryOrderDirection.DESCENDING;
      } else {
        newOrderDirection[headerType] = QueryOrderDirection.ASCENDING;
      }
      this.filters = newOrderDirection;
      this.fetchCampaigns({
        name: this.campaignName,
        order: this.filters,
      });
    },
    debounceName() {
      this.$emit('loader', true);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.fetchCampaigns({
          name: this.campaignName,
          order: this.filters,
        });
      }, 1000);
    },
    fetchCampaigns(args) {
      this.$emit('loader', true);
      this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST', args)
        .finally(() => {
          this.$emit('loader', false);
        });
    },
  },
};
</script>
