<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3>Campaign performance</h3>
      <div
        class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center"
      >
        <b-button
          variant="outline-primary"
        >
          View reporting
        </b-button>
        <b-button
          variant="primary"
        >
          Create new campaign
        </b-button>
      </div>
    </div>

    <ReportingTableHeader
      :title="'12 campaigns'"
    />
    <b-table-simple
      id="table-filters-performance"
      class="ps_gs-table-products mb-3"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="({type, tooltip, sorting}, index) in fields"
            :key="type"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible pl-2': index === 0}"
          >
            <div class="flex align-items-center text-nowrap">
              <b-button
                v-if="sorting"
                @click="sort()"
                variant="invisible"
                class="p-0 border-0"
              >
                <span>{{ $t(`campaigns.labelCol.${type}`) }}</span>
                <template v-if="sortDirection === 'asc'">
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
                v-if="tooltip"
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
          v-for="campaign in campaigns"
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
  </div>
</template>

<script>
import SmartShoppingCampaignTableListRow from './smart-shopping-campaign-table-list-row.vue'
import ReportingTableHeader from './reporting/commons/reporting-table-header.vue'

export default {
  name: 'SmartShoppingCampaignTableList',
  components: {
    SmartShoppingCampaignTableListRow,
    ReportingTableHeader,
  },
  data() {
    return {
      loading: false,
      sortDirection: 'asc',
      items: [],
      fields: [
        {
          type: 'campaign',
          sorting: true,
        },
        {
          type: 'duration',
        },
        {
          type: 'status',
          tooltip: true,
        },
        {
          type: 'target',
        },
        {
          type: 'product',
        },
        {
          type: 'dailyBudget',
        },
        {
          type: 'actions',
        },
      ],
      campaigns: [
        {
          name: 'Promotion 1',
          duration : '2021/03/01 - 2021/05/31',
          status : 'ended',
          target : 'France',
          product : 'Selected product (12)',
          dailyBudget : '$125',
        },
        {
          name: 'Promotion 2',
          duration : 'From 2021/03/01',
          status : 'pending',
          target : 'France',
          product : 'Selected product (108551)',
          dailyBudget : '$25',
        },
        {
          name: 'Smart shopping campaign avec un nom vraiment long, car la limite de caractères est de 125 pour une smart shopping campaign...',
          duration : '2021/03/01 - 2021/12/31',
          status : 'eligible',
          target : 'France',
          product : 'All synced products',
          dailyBudget : '$25',
        },
        {
          name: 'Smart shopping campaign',
          duration : '2021/03/01 - 2021/12/31',
          status : 'paused',
          target : 'France',
          product : 'All synced products',
          dailyBudget : '$25',
        },
      ],
    }
  },
  methods: {
    sort() {

    },
  },
};
</script>
