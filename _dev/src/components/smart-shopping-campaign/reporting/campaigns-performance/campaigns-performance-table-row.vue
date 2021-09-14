<template>
  <b-tr>
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
</template>

<script>
import StickyColumnsObserver from '@/utils/StickyColumnsObserver.ts';

export default {
  mixins: [StickyColumnsObserver],
  name: 'CampaignsPerformanceTableRow',
  props: {
    name: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    impression: {
      type: String,
      required: true,
    },
    clicks: {
      type: String,
      required: true,
    },
    adSpent: {
      type: String,
      required: true,
    },
    conversions: {
      type: String,
      required: true,
    },
    sales: {
      type: String,
      required: true,
    },
  },
};
</script>
