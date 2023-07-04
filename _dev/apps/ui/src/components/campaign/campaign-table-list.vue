<template>
  <div>
    <BannerCampaigns
      v-if="!inNeedOfConfiguration"
      @openPopinRemarketingTag="remarketingTagPopin"
    />
    <div
      class="d-flex justify-content-between align-items-baseline"
    >
      <h3 class="ps_gs-fz-20 font-weight-600">
        {{ $t('smartShoppingCampaignList.tableTitle') }}
      </h3>
      <div class="d-flex">
        <b-button
          v-if="remarketingTag && campaignList.length && !inNeedOfConfiguration"
          data-test-id="redirect-to-reporting-button"
          size="sm"
          class="mb-2 mr-2"
          variant="outline-primary"
          @click="redirectToReporting"
        >
          {{ $t('cta.viewReporting') }}
        </b-button>
      </div>
    </div>
    <ReportingTableHeader
      class="mt-n1"
      v-if="!inNeedOfConfiguration"
      :title="$tc(`smartShoppingCampaignList.xCampaign`,
                  campaignList.length, [campaignList.length])"
      :use-date="false"
    />
    <!-- TODO : use this header when API returs only GMC linked campaigns -->
    <!-- <ReportingTableHeader
      :subtitle="$t('smartShoppingCampaignCreation.descriptiveMessage',[
        $options.googleUrl.googleAdsAccount
      ])"
      :title="$tc(`smartShoppingCampaignList.xCampaign`,
        campaignList.length, [campaignList.length])"
      :use-date="false"
    /> -->

    <div>
      <b-table-simple
        id="table-filters-performance"
        class="ps_gs-table-products mb-0"
        :class="{'table-with-maxheight b-table-sticky-header' : !inNeedOfConfiguration}"
        :table-class="{'border-bottom-0': loading}"
        variant="light"
        responsive="xl"
      >
        <b-thead :style="inNeedOfConfiguration ? {filter:'blur('+4+'px)'} : '' ">
          <b-tr class="bg-prestashop-bg">
            <b-th
              v-for="(type, index) in campaignHeaderList"
              :key="type"
              class="font-weight-600"
              :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 0}"
            >
              <div class="flex align-items-center text-nowrap">
                <b-button
                  v-if="hasSorting(type) && !inNeedOfConfiguration"
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
                  v-if="hasToolTip(type) && !inNeedOfConfiguration"
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
                v-if="hasInput(type)"
                id="campaign-name-input-filter"
                v-model="campaignName"
                :placeholder="$t('general.searchByX',
                                 [$t(`campaigns.labelCol.${type}`).toLowerCase()])"
                size="sm"
                class="border-0"
                type="text"
                :disabled="!!inNeedOfConfiguration"
                @keyup="debounceName()"
              />
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

<script>
import CampaignTableListRow from './campaign-table-list-row.vue';
import ReportingTableHeader from './reporting/commons/reporting-table-header.vue';
import CampaignSummaryListHeaderType from '@/enums/campaigns-summary/CampaignSummaryListHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import googleUrl from '../../assets/json/googleUrl.json';
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
    hasToolTip(headerType) {
      return headerType === CampaignSummaryListHeaderType.STATUS
       || headerType === CampaignSummaryListHeaderType.PRODUCTS;
    },
    hasInput(headerType) {
      return headerType === CampaignSummaryListHeaderType.CAMPAIGN;
    },
    hasSorting(headerType) {
      return headerType === CampaignSummaryListHeaderType.DURATION;
    },
    redirectToReporting() {
      this.$router.push({
        name: 'reporting',
      });
    },
    sortByType(headerType) {
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

    debounceName() {
      this.$emit('loader', true);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.commit('campaigns/SET_SSC_LIST_ORDERING', {
          name: this.campaignName,
        });
        this.fetchCampaigns();
      }, 1000);
    },

    fetchCampaigns(isNewRequest = true) {
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
    const tableBody = document.getElementsByClassName(
      'table-with-maxheight',
    )[0];

    if (tableBody) {
      tableBody.addEventListener('scroll', this.handleScroll);
    }

    if (this.inNeedOfConfiguration) {
      this.$emit('loader', false);
      return;
    }
    this.$emit('loader', false);
  },
  beforeDestroy() {
    const tableBody = document.getElementsByClassName(
      'table-with-maxheight',
    )[0];

    if (tableBody) {
      tableBody.removeEventListener('scroll', this.handleScroll);
    }
  },
  googleUrl,
  CampaignTypes,
};
</script>
