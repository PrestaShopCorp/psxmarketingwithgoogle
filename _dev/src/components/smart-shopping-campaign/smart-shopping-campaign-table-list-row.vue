<template>
  <b-tr>
    <b-td
      class="b-table-sticky-column text-primary pl-2"
    >
      <b-button
        variant="link"
        class="font-weight-normal ps_gs-fz-12 p-0 m-0 btn-max-width"
        :title="campaign.campaignName"
      >
        {{ campaign.campaignName }}
      </b-button>
    </b-td>
    <b-td class="ps_gs-fz-12 text-nowrap">
      {{ campaignDuration }}
    </b-td>
    <b-td
      class="ps_gs-fz-12 ps_gs-cell-status"
      :class="`ps_gs-cell-status--${campaign.status}`"
    >
      {{ $t(`campaigns.status.${campaign.status}`) }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaignCountryName }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaignProducts }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.dailyBudget }} {{ campaign.currencyCode }}
    </b-td>
    <td class="ps_gs-fz-12 text-right">
      <b-dropdown
        variant="invisible"
        no-caret
        :id="`actions-menu-campaign-${campaign.campaignName}`"
        class="ps-dropdown psxmarketingwithgoogle-dropdown w-auto py-0 pr-0"
        menu-class="ps-dropdown__menu-small rounded"
        toggle-class="px-1"
        boundary="window"
      >
        <template #button-content>
          <i class="material-icons ps_gs-fz-20 mx-auto">more_vert</i>
          <span class="sr-only">
            {{ $t('cta.openActionsMenu', [campaign.campaignName]) }}
          </span>
        </template>
        <b-dropdown-item-button
          @click="goToCampaignPage(campaign.campaignName)"
        >
          {{ $t('cta.modifyTheCampaign') }}
        </b-dropdown-item-button>
        <b-dropdown-item-button
          @click="isPaused()
            ? resumeCampaign()
            : pauseCampaign()"
        >
          {{ isPaused()
            ? $t('cta.resumeCampaign')
            : $t('cta.pauseCampaign')
          }}
        </b-dropdown-item-button>
        <b-dropdown-item
          :href="$options.googleUrl.googleAdsAccount"
          target="_blank"
          link-class="external_link-no_icon"
        >
          {{ $t('cta.viewInGoogleAds') }}
        </b-dropdown-item>
      </b-dropdown>
    </td>
  </b-tr>
</template>

<script>
import StickyColumnsObserver from '@/utils/StickyColumnsObserver.ts';
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  mixins: [StickyColumnsObserver],
  name: 'SmartShoppingCampaignTableListRow',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
  computed: {
    campaignDuration() {
      return this.campaign.endDate.length > 1 ? this.campaign.startDate + this.campaign.endDate
        : `From ${this.campaign.startDate}`;
    },
    campaignCountryName() {
      return this.$options.filters.changeCountriesCodesToNames([this.campaign.targetCountry])[0];
    },
    campaignProducts() {
      return this.campaign.productFilters?.length
        ? `Selected products(${this.campaign.productFilters.reduce((out, inp) => out + inp.values.length, 0)})`
        : 'All synced products';
    },
  },
  methods: {
    goToCampaignPage() {
      // TODO Go to campaign page to edit it
      console.log('goToCampaignPage', this.campaign.campaignName);
    },
    isPaused() {
      // TODO handle if paused or not
      return this.campaign.status === 'paused';
    },
    pauseCampaign() {
      console.log('pauseCampaign', this.campaign.campaignName);
    },
    resumeCampaign() {
      console.log('resumeCampaign', this.campaign.campaignName);
    },
  },
  googleUrl,
};
</script>
