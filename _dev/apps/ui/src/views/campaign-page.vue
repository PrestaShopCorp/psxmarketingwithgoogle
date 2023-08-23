<template>
  <div>
    <b-skeleton-wrapper
      v-if="$route.name === 'campaign'"
      :loading="!allDataLoaded"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>

      <BannerCampaigns
        v-if="!accountHasAtLeastOneCampaign"
        @clickToCreateCampaign="onClickToCreateCampaign"
      />

      <div class="d-flex justify-content-between mb-2">
        <b-button
          v-if="!inNeedOfConfiguration && accountHasAtLeastOneCampaign"
          size="sm"
          variant="primary"
          @click="onClickToCreateCampaign"
        >
          {{ $t('cta.createPMaxCampaign') }}
        </b-button>
        <KeyMetricsPeriodSelector
          :in-need-of-configuration="inNeedOfConfiguration || !accountHasAtLeastOneCampaign"
          class="ml-auto"
        />
      </div>

      <KeyMetricsBlock
        :in-need-of-configuration="inNeedOfConfiguration"
        @clickToCreateCampaign="onClickToCreateCampaign"
      />

      <campaign-table-list
        v-if="!inNeedOfConfiguration"
        :loading="!allDataLoaded"
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </b-skeleton-wrapper>
    <!-- Need this new router-view since we now have nested children routes -->
    <router-view  v-else/>
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTrackingCampaignPage"
      modal-id="SSCPopinActivateTrackingCampaignPage"
    />
  </div>
</template>

<script lang="ts">
import SSCPopinActivateTracking from '../components/campaigns/ssc-popin-activate-tracking.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import BannerCampaigns from '@/components/commons/banner-campaigns.vue';
import KeyMetricsBlock from '@/components/campaign/reporting/key-metrics/key-metrics-block.vue';
import KeyMetricsPeriodSelector from '@/components/campaign/reporting/key-metrics/key-metrics-period-selector.vue';
import CampaignTableList from '@/components/campaign/campaign-table-list.vue'
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  components: {
    BannerCampaigns,
    CampaignTableList,
    KeyMetricsBlock,
    KeyMetricsPeriodSelector,
    SSCPopinActivateTracking,
  },

  data() {
    return {
      allDataLoaded: false,
    };
  },
  computed: {
    inNeedOfConfiguration() {
      return !this.googleAdsIsServing;
    },
    googleAdsIsServing() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_IS_SERVING'];
    },
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_ALL_CAMPAIGNS']?.length;
    },
    remarketingTagIsSet() {
      return this.$store.getters['campaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('campaigns/WARMUP_STORE');
    },
    onClickToCreateCampaign(): void {
      this.$segment.track('[GGL] Click on Create your first campaign - Campaign tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      // Prevent popin for opening if tracking is a campaign exists
      if (this.remarketingTagIsSet) {
        this.$router.push({
          name: 'campaign-creation',
        });
      } else {
        this.onOpenPopinActivateTracking();
      }
    },
    onOpenPopinActivateTracking() {
      this.$bvModal.show(
        this.$refs.SSCPopinActivateTrackingCampaignPage.$refs.modal.id,
      );
    },
  },
  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/WARMUP_STORE');
    }
    this.getDatas()
      .finally(() => {
        this.allDataLoaded = true;
      });
  },
  CampaignTypes,
};
</script>
