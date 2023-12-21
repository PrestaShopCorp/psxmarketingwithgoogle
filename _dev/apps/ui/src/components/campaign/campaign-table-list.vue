<template>
  <div>
    <b-card
      no-body
      class="ps_gs-onboardingcard"
      v-if="campaignList.length || loading || fetchingCampaigns || apiFailed"
    >
      <template #header>
        <p class="mb-0 ps_gs-onboardingcard__title">
          {{ $t('campaigns.listTitle') }}
        </p>
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
                v-for="(type) in campaignHeaderList"
                :key="type"
                class="font-weight-500"
                :class="{'ps_gs-table-performance-header': isPerformanceInfo(type)}"
              >
                <b-skeleton-wrapper
                  :loading="loading || fetchingCampaigns"
                >
                  <template #loading>
                    <b-skeleton />
                  </template>

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
                      <template v-if="queryOrderDirection[type] === 'DESC'">
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
                </b-skeleton-wrapper>
              </b-th>
            </b-tr>
          </b-thead>

          <b-tbody class="bg-white">
            <template
              v-if="loading || fetchingCampaigns"
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
          :active-page="activePage"
          :selected-filter-quantity-to-show="pageSize"
        />
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import {mapGetters} from 'vuex';
import {defineComponent} from 'vue';
import GettersTypes from '@/store/modules/campaigns/getters-types';
import MutationsTypes from '@/store/modules/campaigns/mutations-types';
import {CampaignListOrdering} from '@/store/modules/campaigns/state';
import CampaignTableListRow from './campaign-table-list-row.vue';
import CampaignSummaryListHeaderType from '@/enums/campaigns-summary/CampaignSummaryListHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import googleUrl from '@/assets/json/googleUrl.json';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import TableApiError from '@/components/commons/table-api-error.vue';
import TablePageControls from '@/components/commons/table-page-controls.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default defineComponent({
  name: 'CampaignTableList',
  components: {
    CampaignTableListRow,
    TableApiError,
    TablePageControls,
  },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      fetchingCampaigns: false as boolean,
    };
  },
  computed: {
    ...mapGetters('campaigns', {
      campaignList: GettersTypes.GET_CAMPAIGNS_LIST,
      apiFailed: GettersTypes.GET_CAMPAIGNS_LIST_ERROR,
      pageSize: GettersTypes.GET_CAMPAIGNS_LIST_LIMIT,
    }),
    campaignHeaderList() {
      return Object.values(CampaignSummaryListHeaderType);
    },
    totalPages(): number {
      const totalPages = this.$store.getters[`campaigns/${GettersTypes.GET_CAMPAIGNS_TOTAL}`]
      / this.$store.getters[`campaigns/${GettersTypes.GET_CAMPAIGNS_LIST_LIMIT}`];

      if (totalPages < 1) {
        return 1;
      }
      return Math.ceil(totalPages);
    },
    activePage: {
      get(): number {
        return this.$store.getters[
          `campaigns/${GettersTypes.GET_CAMPAIGNS_LIST_ACTIVE_PAGE}`
        ];
      },
      set(page: number): void {
        this.$store.commit(
          `campaigns/${MutationsTypes.SET_CAMPAIGNS_LIST_ACTIVE_PAGE}`,
          page,
        );
        this.fetchCampaigns();
      },
    },
    queryOrderDirection: {
      get(): CampaignListOrdering {
        return this.$store.getters[
          'campaigns/GET_CAMPAIGNS_LIST_ORDERING'
        ];
      },
      set(orderDirection: CampaignListOrdering): void {
        this.$store.commit(
          'campaigns/SET_CAMPAIGNS_LIST_ORDERING',
          orderDirection,
        );
        this.fetchCampaigns();
        this.$segment.track('[GGL] Campaigns list - Update sorting', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,
          ...orderDirection,
        });
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
      return this.isPerformanceInfo(headerType)
        || headerType === CampaignSummaryListHeaderType.DURATION;
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
      const newOrderDirection = {};

      if (
        this.queryOrderDirection[headerType] === QueryOrderDirection.DESCENDING
      ) {
        newOrderDirection[headerType] = QueryOrderDirection.ASCENDING;
      } else {
        newOrderDirection[headerType] = QueryOrderDirection.DESCENDING;
      }
      this.queryOrderDirection = newOrderDirection;
    },
    async fetchCampaigns() {
      this.fetchingCampaigns = true;
      await this.$store.dispatch('campaigns/GET_CAMPAIGNS_LIST');
      this.fetchingCampaigns = false;
    },
    changeLimit(event: number) {
      this.$store.commit(`campaigns/${MutationsTypes.SET_CAMPAIGNS_LIST_PAGE_SIZE}`, event);
      this.fetchCampaigns();
    },
    changePageTo(pageNumber: number) {
      this.$store.commit(`campaigns/${MutationsTypes.SET_CAMPAIGNS_LIST_ACTIVE_PAGE}`, pageNumber);
      this.fetchCampaigns();
    },
  },
  mounted() {
    this.$root.$on('changeLimit', this.changeLimit);
    this.$root.$on('changePage', this.changePageTo);
    this.fetchCampaigns();
    this.$store.dispatch('campaigns/GET_DIMENSIONS_FILTERS', null);
  },
  beforeDestroy() {
    this.$root.$off('changeLimit', this.changeLimit);
    this.$root.$off('changePage', this.changePageTo);
  },
  googleUrl,
  CampaignTypes,
});
</script>
