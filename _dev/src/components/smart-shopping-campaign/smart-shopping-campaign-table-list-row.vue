<template>
  <b-tr>
    <b-td
      class="b-table-sticky-column text-primary pl-2"
    >
      <b-button
        variant="link"
        class="font-weight-normal ps_gs-fz-12 p-0 m-0 btn-max-width"
        :title="campaign.campaignName"
        @click="goToCampaignPage(campaign.campaignName)"
      >
        {{ campaign.campaignName }}
      </b-button>
    </b-td>
    <b-td class="ps_gs-fz-12 text-nowrap">
      {{ campaignDuration }}
    </b-td>
    <b-td
      class="ps_gs-fz-12 ps_gs-cell-status"
      :class="`ps_gs-cell-status--${campaign.status.toLowerCase()}`"
    >
      {{ $t(`campaigns.status.${campaign.status.toLowerCase()}`) }}
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
import googleUrl from '@/assets/json/googleUrl.json';
import CampaignStatus from '@/enums/reporting/CampaignStatus';

export default {
  name: 'SmartShoppingCampaignTableListRow',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
  computed: {
    campaignDuration() {
      return this.campaign.endDate?.length > 1
        ? `${this.$options.filters.timeConverterToDate(this.campaign.startDate)
        }-${this.$options.filters.timeConverterToDate(this.campaign.endDate)}`
        : `From ${this.$options.filters.timeConverterToDate(this.campaign.startDate)}`;
    },
    campaignCountryName() {
      return this.$options.filters.changeCountriesCodesToNames([this.campaign.targetCountry])[0];
    },
    campaignProducts() {
      return this.$t('smartShoppingCampaignCreation.inputAllSyncedProducts');
    },
    // No need for this since we can't filter yet
    // campaignProducts() {
    //   return this.campaign.productFilters?.length
    // eslint-disable-next-line
    //     ? `Selected products(${this.campaign.productFilters.reduce((out, inp) => out + inp.values.length, 0)})`
    //     : this.$t('smartShoppingCampaignCreation.inputAllSyncedProducts');
    // },
  },
  methods: {
    goToCampaignPage() {
      // TODO Go to campaign page to edit it
      this.$router.push(`/campaign/edit/${this.campaign.campaignName}`);
      console.log('goToCampaignPage', this.campaign.campaignName);
    },
    isPaused() {
      // TODO handle if paused or not
      return this.campaign.status === CampaignStatus.PAUSED;
    },
    pauseCampaign() {
      const payload = {
        campaignName: this.campaign.campaignName,
        status: CampaignStatus.PAUSED,
      };
      this.$store.dispatch('smartShoppingCampaigns/CHANGE_STATUS_OF_SSC', payload);
    },
    resumeCampaign() {
      const payload = {
        campaignName: this.campaign.campaignName,
        status: CampaignStatus.ELIGIBLE,
      };
      this.$store.dispatch('smartShoppingCampaigns/CHANGE_STATUS_OF_SSC', payload);
    },
  },
  googleUrl,
};
</script>
