<template>
  <b-tr>
    <b-td
      class="ps_gs-fz-12 ps_gs-cell-status pr-0"
      :class="`ps_gs-cell-status--${campaign.status.toLowerCase()}`"
    >
    </b-td>
    <b-td
      class="text-primary pl-2
      justify-content-between align-items-baseline"
    >
      <b-link
        variant="link"
        class="font-weight-normal ps_gs-fz-12 p-0 m-0 btn-max-width"
        :title="campaign.campaignName"
        @click="goToCampaignPage(campaign.campaignName)"
      >
        {{ campaign.campaignName }}
      </b-link>
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaignDuration }}
    </b-td>
    <b-td class="ps_gs-fz-12 ps_gs-table-performance-cell">
      {{ campaign.impressions }}
    </b-td>
    <b-td class="ps_gs-fz-12 ps_gs-table-performance-cell">
      {{ campaign.clicks }}
    </b-td>
    <b-td class="ps_gs-fz-12 ps_gs-table-performance-cell">
      {{ campaign.conversions }}
    </b-td>
    <b-td class="ps_gs-fz-12 ps_gs-table-performance-cell">
      {{ campaign.sales|formatPrice(campaign.currencyCode || currencyCode) }}
    </b-td>
    <b-td class="ps_gs-fz-12 ps_gs-table-performance-cell">
      {{ campaign.adSpend|formatPrice(campaign.currencyCode || currencyCode) }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaignCountryName }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.dailyBudget|formatPrice(campaign.currencyCode || currencyCode) }}
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

<script lang="ts">
import googleUrl from '@/assets/json/googleUrl.json';
import CampaignStatus, {CampaignStatusToggle} from '@/enums/reporting/CampaignStatus';
import compareYears from '@/utils/CompareYears';
import { PropType } from 'vue';
import { CampaignObject } from '@/store/modules/campaigns/state';
import { timeConverterToDate } from '@/utils/Dates';

export default {
  name: 'CampaignTableListRow',
  props: {
    campaign: {
      type: Object as PropType<CampaignObject>,
      required: true,
    },
  },
  computed: {
    campaignDuration() {
      if (this.campaign.status === CampaignStatus.ENDED) {
        return this.$t('campaigns.dateLabel.endedOnX', {endDate: timeConverterToDate(this.campaign.endDate)});
      }
      if (this.campaign.endDate) {
        const isThereAnEndDate = compareYears(this.campaign.endDate);

        if (isThereAnEndDate) {
          return this.$t('campaigns.dateLabel.fromXToX', {
            startDate: timeConverterToDate(this.campaign.startDate),
            endDate: timeConverterToDate(this.campaign.endDate),
          });
        }
      }
      return this.$t('campaigns.dateLabel.from', {startDate: timeConverterToDate(this.campaign.startDate)});
    },
    campaignCountryName() {
      return this.$options.filters.changeCountriesCodesToNames([this.campaign.targetCountry])[0];
    },
    currencyCode() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
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
      this.$store.dispatch('campaigns/CHANGE_STATUS_OF_SSC', payload);
    },
    resumeCampaign() {
      const payload = {
        id: this.campaign.id,
        status: CampaignStatusToggle.ENABLED,
      };
      this.$store.dispatch('campaigns/CHANGE_STATUS_OF_SSC', payload);
    },
  },
  googleUrl,
};
</script>
