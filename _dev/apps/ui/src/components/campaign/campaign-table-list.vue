<template>
  <div>
    <b-card
      no-body
      class="ps_gs-onboardingcard"
      v-if="campaignList.length || loading || apiFailed"
    >
      <template #header>
        <ol class="mb-0 list-inline d-flex align-items-center ps_gs-breadcrumb">
          <li class="list-inline-item ps_gs-breadcrumb__item">
            {{ $t('campaigns.listTitle') }}
          </li>
        </ol>
      </template>
      <b-card-body
        body-class="p-0"
      >

        <b-table-simple
          id="table-filters-performance"
          class="card mb-0"
          responsive="xl"
        >
          <b-thead
            class="card-header"
          >
            <b-tr>
              <b-th
                v-for="(type, index) in campaignHeaderList"
                :key="type"
                class="font-weight-500"
                :class="{'ps_gs-table-performance-header': isPerformanceInfo(type)}"
              >
                <div class="flex align-items-center">
                  <b-button
                    v-if="hasSorting(type)"
                    @click="sortByType(type)"
                    variant="invisible"
                    class="p-0 border-0 text-nowrap"
                  >
                    <span
                      class="ps_gs-fz-16 font-weight-500"
                    >
                      {{ $t(`campaigns.labelCol.${type}`) }}
                    </span>
                    <template v-if="queryOrderDirection[type] === 'ASC'">
                      <i class="material-icons ps_gs-fz-14">expand_more</i>
                      <span class="sr-only">{{ $t('cta.clickToSortAsc') }}</span>
                    </template>
                    <template v-else>
                      <i class="material-icons ps_gs-fz-14">expand_less</i>
                      <span class="sr-only">{{ $t('cta.clickToSortDesc') }}</span>
                    </template>
                  </b-button>
                  <span v-else-if="hasTitleDisplayed(type)">
                    {{ $t(`campaigns.labelCol.${type}`) }}
                  </span>
                </div>
              </b-th>
            </b-tr>
          </b-thead>

          <b-tbody class="bg-white">
            <template
              v-if="loading"
            >
              <b-tr
                v-for="index in pageSize"
                :key="index"
                class="justify-content-between align-items-center py-3"
              >
                <b-td
                  v-for="(type, textIndex) in campaignHeaderList"
                  :key="textIndex"
                  :class="{'ps_gs-table-performance-cell': isPerformanceInfo(type)}"
                >
                  <b-skeleton
                    class="mb-0 px-1"
                    width="100%"
                  />
                </b-td>
              </b-tr>
            </template>

            <table-api-error
              v-else-if="apiFailed" 
              :colspan="campaignHeaderList.length"
            />

            <template
              v-else-if="campaignList.length"
              class=" ps_gs-onboardingcard__not-configured"
            >
              <CampaignTableListRow
                v-for="campaign in campaignList"
                :key="campaign.campaignName"
                :campaign="campaign"
              />
            </template>
          </b-tbody>
        </b-table-simple>
        <TablePageControls
          :total-pages="totalPages"
          :active-page="activePage+1"
          :selected-filter-quantity-to-show="pageSize"
        />
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import CampaignTableListRow from './campaign-table-list-row.vue';
import ReportingTableHeader from './reporting/commons/reporting-table-header.vue';
import CampaignSummaryListHeaderType from '@/enums/campaigns-summary/CampaignSummaryListHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import googleUrl from '@/assets/json/googleUrl.json';
import BannerCampaigns from '@/components/commons/banner-campaigns.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import TableApiError from '@/components/commons/table-api-error.vue';
import TablePageControls from '@/components/commons/table-page-controls.vue';

export default {
  name: 'CampaignTableList',
  components: {
    CampaignTableListRow,
    ReportingTableHeader,
    BannerCampaigns,
    TableApiError,
    TablePageControls,
  },
  data() {
    return {
      apiFailed: false as boolean,
      pageSize: 10 as number,
      activePage: 0 as number,
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
      return this.$store.state.campaigns.campaigns;
    },
    totalPages(): number {
      return 2;
    },

    queryOrderDirection: {
      get() {
        return this.$store.getters[
          'campaigns/GET_CAMPAIGNS_LIST_ORDERING'
        ];
      },
      set(orderDirection) {
        this.$store.commit(
          'campaigns/SET_CAMPAIGNS_LIST_ORDERING',
          orderDirection,
        );
        this.fetchCampaigns();
      },
    },
    remarketingTag() {
      return this.$store.getters[
        'campaigns/GET_REMARKETING_TRACKING_TAG_STATUS'
      ];
    },
  },
  methods: {
    hasTitleDisplayed(headerType: CampaignSummaryListHeaderType): boolean {
      return headerType !== CampaignSummaryListHeaderType.STATUS;
    },
    hasSorting(headerType: CampaignSummaryListHeaderType): boolean {
      return this.isPerformanceInfo(headerType);
    },
    isPerformanceInfo(headerType: CampaignSummaryListHeaderType): boolean {
      return [
        CampaignSummaryListHeaderType.IMPRESSIONS,
        CampaignSummaryListHeaderType.CLICKS,
        CampaignSummaryListHeaderType.AD_SPEND,
        CampaignSummaryListHeaderType.CONVERSIONS,
        CampaignSummaryListHeaderType.SALES,
      ].includes(headerType);
    },
    sortByType(headerType: CampaignSummaryListHeaderType) {
      // create new object for satisfy deep getter of vueJS
      const newOrderDirection = {...this.queryOrderDirection};

      if (
        this.queryOrderDirection[headerType] === QueryOrderDirection.ASCENDING
      ) {
        newOrderDirection[headerType] = QueryOrderDirection.DESCENDING;
      } else {
        newOrderDirection[headerType] = QueryOrderDirection.ASCENDING;
      }
      this.queryOrderDirection = newOrderDirection;
    },
    fetchCampaigns(isNewRequest: boolean = true) {
      this.$store
        .dispatch('campaigns/GET_CAMPAIGNS_LIST', {isNewRequest})
        .then(() => {
          this.$store.dispatch('campaigns/GET_DIMENSIONS_FILTERS', null);
        })
    },
  },
  googleUrl,
  CampaignTypes,
};
</script>
