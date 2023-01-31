<template>
  <b-tr>
    <b-td
      class="b-table-sticky-column text-primary"
    >
      <b-button
        v-if="campaign.id"
        variant="link"
        @click="goToCampaignPage"
        class="p-0 m-0 font-weight-normal ps_gs-fz-12"
      >
        {{ campaign.name }}
      </b-button>
      <span
        v-else
        class="p-0 m-0 font-weight-normal ps_gs-fz-12"
      >
        {{ campaign.name }}
      </span>
      <b-badge
        variant="secondary"
        class="ps_gs-fz-12 m-1"
        v-if="campaignType"
      >
        {{ campaignType }}
      </b-badge>
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
      {{ Number(campaign.conversions.toFixed(4).replace(/\.00$/, '')) }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ campaign.sales|formatPrice(currencyCode) }}
    </b-td>
  </b-tr>
</template>

<script>
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

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
    campaignType() {
      if (this.campaign.type === CampaignTypes.SMART_SHOPPING) {
        return 'SSC';
      }
      if (this.campaign.type === CampaignTypes.PERFORMANCE_MAX) {
        return 'PMax';
      }
      return null;
    },
  },
  methods: {
    goToCampaignPage() {
      this.$router.push({
        name: 'campaign-edition',
        params: {
          id: this.campaign.id,
        },
      });
    },
  },
};
</script>
