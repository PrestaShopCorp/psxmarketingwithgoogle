<template>
  <b-tr>
    <b-td
      class="b-table-sticky-column text-primary"
    >
      <b-button
        variant="link"
        class="p-0 m-0 font-weight-normal ps_gs-fz-12"
      >
        {{ campaign.name }}
      </b-button>
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.budget }}
    </b-td>
    <b-td
      class="ps_gs-fz-12 ps_gs-cell-status"
      :class="`ps_gs-cell-status--${campaign.status}`"
    >
      {{ $t(`campaigns.status.${campaign.status}`) }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.impressions }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.clicks }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.adSpend }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.conversions }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.sales }}
    </b-td>
  </b-tr>
</template>

<script>
import StickyColumnsObserver from '@/utils/StickyColumnsObserver.ts';

export default {
  mixins: [StickyColumnsObserver],
  name: 'CampaignsPerformanceTableRow',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
};
</script>
