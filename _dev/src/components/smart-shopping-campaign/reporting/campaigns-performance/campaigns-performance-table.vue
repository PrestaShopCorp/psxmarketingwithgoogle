<template>
  <div>
    <ReportingTableHeader
      :title="$t('campaigns.campaignsPerformanceTable.title')"
      :subtitle="$t('campaigns.campaignsPerformanceTable.subTitle')"
      start-date="04/06/2021"
      end-date="04/07/2021"
    />
    <b-table-simple
      id="table-campaigns-performance"
      class="ps_gs-table-products mb-3"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="({type, tooltip}, index) in fields"
            :key="type"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 0}"
          >
            <div class="flex align-items-center text-nowrap">
              <span>{{ $t(`campaigns.labelCol.${type}`) }}</span>
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
        <b-tr
          v-for="{
            name,
            budget,
            status,
            impression,
            clicks,
            adSpent,
            conversions,
            sales,
          } in campaigns"
          :key="name"
        >
          <b-td
            class="b-table-sticky-column text-primary"
          >
            <b-button
              variant="link"
              class="font-weight-normal ps_gs-fz-12 p-0 m-0"
            >
              {{ name }}
            </b-button>
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ budget }}
          </b-td>
          <b-td
            class="ps_gs-fz-12 ps_gs-cell-status"
            :class="`ps_gs-cell-status--${status}`"
          >
            {{ $t(`campaigns.status.${status}`) }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ impression }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ clicks }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ adSpent }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ conversions }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ sales }}
          </b-td>
        </b-tr>
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
import ReportingTableHeader from '../commons/reporting-table-header.vue';

export default {
  name: 'CampaignsPerformanceTable',
  components: {
    ReportingTableHeader,
  },
  data() {
    return {
      loading: false,
      fields: [
        {
          type: 'campaign',
        },
        {
          type: 'budget',
        },
        {
          type: 'status',
          tooltip: true,
        },
        {
          type: 'impression',
        },
        {
          type: 'clicks',
        },
        {
          type: 'adSpend',
        },
        {
          type: 'conversions',
        },
        {
          type: 'sales',
        },
      ],
      // TODO
      // Adds real datas
      campaigns: [
        {
          name: 'Promotion 1',
          budget: '$125',
          status: 'eligible',
          impression: '25',
          clicks: '0',
          adSpent: '$0',
          conversions: '0',
          sales: '$0',
        },
        {
          name: 'Promotion 2',
          budget: '$10',
          status: 'eligibleLimited',
          impression: '198',
          clicks: '1788',
          adSpent: '$35',
          conversions: '8',
          sales: '$2700',
        },
        {
          name: 'Promotion 3',
          budget: '$125',
          status: 'ended',
          impression: '178998',
          clicks: '178998',
          adSpent: '$125',
          conversions: '178',
          sales: '$178000',
        },
        {
          name: 'Promotion 4',
          budget: '$2000',
          status: 'paused',
          impression: '17899800',
          clicks: '17',
          adSpent: '$12500',
          conversions: '150000',
          sales: '$27815580',
        },
        {
          name: 'Promotion 5',
          budget: '$2',
          status: 'notEligible',
          impression: '5',
          clicks: '0',
          adSpent: '$0',
          conversions: '0',
          sales: '$0',
        },
        {
          name: 'Promotion 6',
          budget: '$125',
          status: 'draft',
          impression: '-',
          clicks: '-',
          adSpent: '-',
          conversions: '-',
          sales: '-',
        },
        {
          name: 'Promotion 7',
          budget: '$125',
          status: 'pending',
          impression: '178998',
          clicks: '178998',
          adSpent: '$125',
          conversions: '178',
          sales: '$178000',
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      // Observer to add class to sticky columns when they are stuck
      document.querySelectorAll('.b-table-sticky-column').forEach((i) => {
        if (i) {
          const observer = new IntersectionObserver(
            (entries) => {
              observerCallback(entries, observer, i);
            },
            {
              root: document.querySelector('.ps_gs-table-products'),
              threshold: 1,
            },
          );
          observer.observe(i);
        }
      });
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-pinned', entry.intersectionRatio < 1);
        });
      };
    });
  },
};
</script>
