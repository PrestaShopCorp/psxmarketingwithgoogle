<template>
  <div>
    <BannerCampaigns
      v-if="!inNeedOfConfiguration"
      @openPopinRemarketingTag="remarketingTagPopin"
    />
    <ReportingTableHeader
      class="mt-n1"
      v-if="!inNeedOfConfiguration"
      :title="$t('campaigns.listTitle')"
      :use-date="false"
    />

    <div>
      <b-table-simple
        id="table-filters-performance"
        class="card"
        responsive="xl"
      >
        <b-thead
          :style="inNeedOfConfiguration ? {filter:'blur('+4+'px)'} : '' "
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
                  v-if="hasSorting(type) && !inNeedOfConfiguration"
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
            v-if="campaignList.length && !inNeedOfConfiguration"
            class=" ps_gs-onboardingcard__not-configured"
          >
            <CampaignTableListRow
              v-for="campaign in campaignList"
              :key="campaign.campaignName"
              :campaign="campaign"
            />
          </template>
          <b-tr
            v-if="inNeedOfConfiguration"
          >
            <b-td :colspan="campaignHeaderList.length">
              <NotConfiguredCard class="mx-auto" />
            </b-td>
          </b-tr>
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
    <SSCPopinActivateTracking
      modal-id="SSCPopinActivateTrackingSSCList"
      ref="SSCPopinActivateTrackingSSCList"
    />
  </div>
</template>

<script lang="ts">
import CampaignTableListRow from './campaign-table-list-row.vue';
import ReportingTableHeader from './reporting/commons/reporting-table-header.vue';
import CampaignSummaryListHeaderType from '@/enums/campaigns-summary/CampaignSummaryListHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import googleUrl from '@/assets/json/googleUrl.json';
import NotConfiguredCard from '@/components/commons/not-configured-card.vue';
import BannerCampaigns from '@/components/commons/banner-campaigns.vue';
import SSCPopinActivateTracking from '@/components/campaigns/ssc-popin-activate-tracking.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  name: 'CampaignTableList',
  components: {
    CampaignTableListRow,
    ReportingTableHeader,
    NotConfiguredCard,
    BannerCampaigns,
    SSCPopinActivateTracking,
  },
  data() {
    return {
      campaignName: null,
      searchQuery: {},
    };
  },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    inNeedOfConfiguration: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    campaignHeaderList() {
      return Object.values(CampaignSummaryListHeaderType);
    },
    campaigns() {
      return this.$store.state.campaigns.campaigns;
    },

    campaignList() {
      const searchQuery = this.searchQuery[CampaignSummaryListHeaderType.CAMPAIGN];

      if (searchQuery) {
        return this.campaigns.filter((campaign) => {
          const nameMatch = campaign.campaignName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return nameMatch;
        });
      }
      return this.campaigns;
    },
    queryOrderDirection: {
      get() {
        return this.$store.getters[
          'campaigns/GET_CAMPAIGNS_LIST_ORDERING'
        ];
      },
      set(orderDirection) {
        this.$store.commit(
          'campaigns/SET_SSC_LIST_ORDERING',
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
      this.$emit('loader', true);
      this.$store
        .dispatch('campaigns/GET_CAMPAIGNS_LIST', {isNewRequest})
        .then(() => {
          this.$store.dispatch('campaigns/GET_DIMENSIONS_FILTERS', null);
        })
        .finally(() => {
          this.$emit('loader', false);
        });
    },
    handleScroll() {
      if (this.loading === true) {
        return;
      }
      const body = document.getElementsByClassName('table-with-maxheight')[0];
      const token = this.$store.getters['campaigns/GET_TOKEN_NEXT_PAGE_CAMPAIGN_LIST'];

      if (
        body.scrollTop >= body.scrollHeight - body.clientHeight
        && body.scrollTop > 0
        && token !== null
      ) {
        this.fetchCampaigns(false);
      }
    },
    remarketingTagPopin() {
      this.$bvModal.show(
        this.$refs.SSCPopinActivateTrackingSSCList.$refs.modal.id,
      );
    },
  },
  async mounted() {
    if (this.inNeedOfConfiguration) {
      this.$emit('loader', false);
      return;
    }
    this.$emit('loader', false);
  },
  googleUrl,
  CampaignTypes,
};
</script>
