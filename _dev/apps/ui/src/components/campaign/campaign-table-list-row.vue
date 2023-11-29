<template>
  <b-tr>
    <b-td
      class=" p-0"
    >
      <span
        class="ps_gs-cell-status"
        :class="`ps_gs-cell-status--${campaign.status?.toLowerCase()}`"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="$t(`campaigns.status.${campaign.status?.toLowerCase()}`)"
      />
    </b-td>

    <b-td
      class="text-primary pl-2
      justify-content-between align-items-baseline"
    >
      <b-link
        variant="link"
        class="font-weight-normal p-0 m-0 btn-max-width"
        :title="campaign.campaignName"
        @click="goToCampaignPage"
      >
        {{ campaign.campaignName }}
      </b-link>
    </b-td>
    <b-td>
      {{ campaignDuration }}
    </b-td>
    <b-td class="ps_gs-table-performance-cell">
      {{ campaign.impressions }}
    </b-td>
    <b-td class="ps_gs-table-performance-cell">
      {{ campaign.clicks }}
    </b-td>
    <b-td class="ps_gs-table-performance-cell">
      {{ campaign.conversions }}
    </b-td>
    <b-td class="ps_gs-table-performance-cell">
      {{ displayAsPrice(campaign.sales) }}
    </b-td>
    <b-td class="ps_gs-table-performance-cell">
      {{ displayAsPrice(campaign.adSpend) }}
    </b-td>
    <b-td>
      {{ campaignCountryName }}
    </b-td>
    <b-td>
      <alert-low-budget
        v-if="campaign.isBudgetBelowMinimum"
        :formated-price="displayAsPrice(campaign.dailyBudget)"
      />
      <span v-else>
        {{ displayAsPrice(campaign.dailyBudget) }}
      </span>
    </b-td>
    <b-td
      class="text-right"
    >
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
          <i class="material-icons ps_gs-fz-20 mx-auto">create</i>
          <span class="sr-only">
            {{ $t('cta.openActionsMenu', [campaign.campaignName]) }}
          </span>
        </template>
        <b-dropdown-item-button
          v-if="isPausable"
          @click="isPaused
            ? resumeCampaign()
            : pauseCampaign()"
        >
          {{ isPaused
            ? $t('cta.resumeCampaign')
            : $t('cta.pauseCampaign')
          }}
        </b-dropdown-item-button>
        <b-dropdown-item-button
          @click="goToCampaignPage"
        >
          {{ $t('cta.modifyTheCampaign') }}
        </b-dropdown-item-button>
      </b-dropdown>
    </b-td>
  </b-tr>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';
import CampaignStatus, {CampaignStatusToggle} from '@/enums/reporting/CampaignStatus';
import compareYears from '@/utils/CompareYears';
import {CampaignPerformanceObject, CampaignStatusPayload} from '@/store/modules/campaigns/state';
import {timeConverterToDate} from '@/utils/Dates';
import {formatPrice} from '../../utils/Price';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import AlertLowBudget from './alert-low-budget.vue';

export default defineComponent({
  name: 'CampaignTableListRow',
  props: {
    campaign: {
      type: Object as PropType<CampaignPerformanceObject>,
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
    currencyCode(): string {
      return this.campaign.currencyCode || this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
    },
    isPaused(): boolean {
      return this.campaign.status === CampaignStatus.PAUSED;
    },
    isPausable(): boolean {
      return ![
        CampaignStatus.DRAFT,
        CampaignStatus.ENDED,
        CampaignStatus.REMOVED,
      ].includes(this.campaign.status);
    },
  },
  methods: {
    displayAsPrice(value: number): string {
      return formatPrice(value, this.currencyCode);
    },
    goToCampaignPage() {
      this.$router.push({
        name: 'campaign-edition',
        params: {
          id: this.campaign.id,
        },
      });
      this.$segment.track('[GGL] Campaigns list - Click on edit button', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    pauseCampaign() {
      this.updateCampaignStatus(CampaignStatusToggle.PAUSED);
    },
    resumeCampaign() {
      this.updateCampaignStatus(CampaignStatusToggle.ENABLED);
    },
    updateCampaignStatus(newStatus: CampaignStatusToggle) {
      this.$store.dispatch('campaigns/CHANGE_STATUS_OF_CAMPAIGN', {
        id: this.campaign.id,
        status: newStatus,
      } as CampaignStatusPayload);
      this.$segment.track('[GGL] Campaigns list - Update status of campaign', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
        newStatus,
      });
    },
  },
  googleUrl,
  components: {
    AlertLowBudget,
  },
});
</script>
