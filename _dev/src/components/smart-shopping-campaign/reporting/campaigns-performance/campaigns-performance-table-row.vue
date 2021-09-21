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
      {{ getFormattedValue(campaign.budget) }}
    </b-td>
    <b-td
      class="ps_gs-fz-12 ps_gs-cell-status"
      :class="`ps_gs-cell-status--${campaign.status.toLowerCase()}`"
    >
      {{ $t(`campaigns.status.${campaign.status.toLowerCase()}`) }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.impressions }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.clicks }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ getFormattedValue(campaign.adSpend) }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.conversions }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ getFormattedValue(campaign.sales) }}
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
  methods: {
    getFormattedValue(value) {
      const googleAdsAccountCurrency = this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'].currency;

      return Intl.NumberFormat(window.i18nSettings.languageCode, {
        style: 'currency',
        currency: googleAdsAccountCurrency,
      }).format(value);
    },
  },
};
</script>
