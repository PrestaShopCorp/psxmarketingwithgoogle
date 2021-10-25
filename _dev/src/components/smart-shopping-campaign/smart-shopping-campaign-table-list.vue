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
          v-if="remarketingTag"
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
    <!-- TODO : use this header when API returs only GMC linked campaigns -->
    <!-- <ReportingTableHeader
      :subtitle="$t('smartShoppingCampaignCreation.descriptiveMessage',[
        $options.googleUrl.googleAdsAccount
      ])"
      :title="campaignList.length + ' campaign(s)'"
      :use-date="false"
    /> -->

    <div>
      <b-table-simple
        id="table-filters-performance"
        class="ps_gs-table-products mb-0 table-ssc-list"
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
                :placeholder="$t('general.searchByX', [type])"
                size="sm"
                class="border-0"
                type="text"
                @keyup="debounceName()"
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
  </div>
</template>

<script>
import SmartShoppingCampaignTableListRow from './smart-shopping-campaign-table-list-row.vue';
import ReportingTableHeader from './reporting/commons/reporting-table-header.vue';
import CampaignSummaryListHeaderType from '@/enums/campaigns-summary/CampaignSummaryListHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import googleUrl from '../../assets/json/googleUrl.json';

export default {
  name: 'SmartShoppingCampaignTableList',
  components: {
    SmartShoppingCampaignTableListRow,
    ReportingTableHeader,
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
    queryOrderDirection: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_SSC_LIST_ORDERING'];
      },
      set(orderDirection) {
        this.$store.commit('smartShoppingCampaigns/SET_SSC_LIST_ORDERING', orderDirection);
        this.fetchCampaigns();
      },
    },
    remarketingTag() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS'];
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
      const newOrderDirection = {...this.queryOrderDirection};
      if (this.queryOrderDirection[headerType] === QueryOrderDirection.ASCENDING) {
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
        this.$store.commit('smartShoppingCampaigns/SET_SSC_LIST_ORDERING', {name: this.campaignName});
        this.fetchCampaigns();
      }, 1000);
    },

    fetchCampaigns(isNewRequest = true) {
      this.$emit('loader', true);
      this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST', isNewRequest)
        .finally(() => {
          this.$emit('loader', false);
        });
    },
    handleScroll() {
      const body = document.getElementsByClassName('table-ssc-list')[0];
      const token = this.$store.getters['smartShoppingCampaigns/GET_TOKEN_NEXT_PAGE_CAMPAIGN_LIST'];
      if (body.scrollTop >= body.scrollHeight - body.clientHeight
      && body.scrollTop > 0
      && token !== null) {
        this.fetchCampaigns(false);
      }
    },
  },
  mounted() {
    const tableBody = document.getElementsByClassName('table-ssc-list')[0];

    if (tableBody) {
      tableBody.addEventListener('scroll', this.handleScroll);
    }

    this.fetchCampaigns();
  },
  beforeDestroy() {
    const tableBody = document.getElementsByClassName('table-ssc-list')[0];

    if (tableBody) {
      tableBody.removeEventListener('scroll', this.handleScroll);
    }
  },
  googleUrl,

};
</script>
