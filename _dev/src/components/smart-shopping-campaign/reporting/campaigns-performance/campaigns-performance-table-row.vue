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
    <b-td
      class="ps_gs-fz-12 ps_gs-cell-status"
      :class="`ps_gs-cell-status--${campaign.status.toLowerCase()}`"
    >
      {{ $t(`campaigns.status.${campaign.status.toLowerCase()}`) }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ campaign.budget|formatPrice(currencyCode) }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ campaign.impressions }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ campaign.clicks }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ campaign.adSpend|formatPrice(currencyCode) }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ campaign.conversions }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ campaign.sales|formatPrice(currencyCode) }}
    </b-td>
  </b-tr>
</template>

<script>
export default {
  name: 'CampaignsPerformanceTableRow',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
  computed: {
    currencyCode() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
    },
  },
};
</script>
