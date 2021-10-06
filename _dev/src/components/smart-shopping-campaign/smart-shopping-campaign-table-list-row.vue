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
    <td class="ps_gs-fz-12 text-center">
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
      </b-dropdown>
    </td>
  </b-tr>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import CampaignStatus, {CampaignStatusToggle} from '@/enums/reporting/CampaignStatus';

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
    // No need for this since we have only one dimension for now
    // campaignProducts() {
    //   return this.campaign.productFilters?.length
    // eslint-disable-next-line
    //     ? `Selected products(${this.campaign.productFilters.reduce((out, inp) => out + inp.values.length, 0)})`
    //     : this.$t('smartShoppingCampaignCreation.inputAllSyncedProducts');
    // },
    campaignProducts() {
      return this.campaign.productFilters?.length
        // eslint-disable-next-line
        ?  this.campaign.productFilters.length + ' ' + this.$t('smartShoppingCampaignCreation.productsSelected')
        : this.$t('smartShoppingCampaignCreation.inputAllSyncedProducts');
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
    isPaused() {
      return this.campaign.status === CampaignStatus.PAUSED;
    },
    pauseCampaign() {
      const payload = {
        id: this.campaign.id,
        status: CampaignStatusToggle.PAUSED,
      };
      this.$store.dispatch('smartShoppingCampaigns/CHANGE_STATUS_OF_SSC', payload);
    },
    resumeCampaign() {
      const payload = {
        id: this.campaign.id,
        status: CampaignStatusToggle.ENABLED,
      };
      this.$store.dispatch('smartShoppingCampaigns/CHANGE_STATUS_OF_SSC', payload);
    },

  },
  googleUrl,
};
</script>
