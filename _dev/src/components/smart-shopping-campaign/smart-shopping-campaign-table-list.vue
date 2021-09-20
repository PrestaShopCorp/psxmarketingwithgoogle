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
        >
          {{ $t('cta.viewReporting') }}
        </b-button>
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 mr-md-0"
          variant="primary"
        >
          {{ $t('cta.createCampaign') }}
        </b-button>
      </div>
    </div>
    <ReportingTableHeader
      :title="'12 campaigns'"
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
          <SmartShoppingCampaignTableListRow
            v-for="campaign in campaignList"
            :key="campaign.name"
            :campaign="campaign"
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
      <TableControls />
    </div>
  </div>
</template>

<script>
import SmartShoppingCampaignTableListRow from './smart-shopping-campaign-table-list-row.vue';
import ReportingTableHeader from './reporting/commons/reporting-table-header.vue';
import CampaignListHeaderType from '@/enums/campaigns-summary/CampaignListHeaderType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import TableControls from '../commons/table-controls.vue';

export default {
  name: 'SmartShoppingCampaignTableList',
  components: {
    SmartShoppingCampaignTableListRow,
    ReportingTableHeader,
    TableControls,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    campaignHeaderList() {
      return Object.values(CampaignListHeaderType);
    },
    campaignList() {
      // TODO Get real list of campaigns
      return [
        {
          name: 'Promotion 1',
          duration: '2021/03/01 - 2021/05/31',
          status: 'ended',
          target: 'France',
          product: 'Selected product (12)',
          dailyBudget: '$125',
        },
        {
          name: 'Promotion 2',
          duration: 'From 2021/03/01',
          status: 'pending',
          target: 'France',
          product: 'Selected product (108551)',
          dailyBudget: '$25',
        },
        {
          name: 'Smart shopping campaign avec un nom vraiment long, car la limite de caractères est de 125 pour une smart shopping campaign...',
          duration: '2021/03/01 - 2021/12/31',
          status: 'eligible',
          target: 'France',
          product: 'All synced products',
          dailyBudget: '$25',
        },
        {
          name: 'Smart shopping campaign',
          duration: '2021/03/01 - 2021/12/31',
          status: 'paused',
          target: 'France',
          product: 'All synced products',
          dailyBudget: '$25',
        },
      ];
    },
    queryOrderDirection: {
      get() {
        // TODO
        /** Inspired by campaigns-performance-table.vue */
        return {
          campaign: QueryOrderDirection.ASCENDING,
        };
      },
      set(orderDirection) {
        // TODO
        console.log(orderDirection);
      },
    },
  },
  methods: {
    hasToolTip(headerType) {
      return headerType === CampaignListHeaderType.STATUS;
    },
    hasSorting(headerType) {
      return headerType === CampaignListHeaderType.CAMPAIGN;
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
};
</script>
