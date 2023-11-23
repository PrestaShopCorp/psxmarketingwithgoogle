<template>
  <div>
    <div
      v-if="$route.name === 'campaign'"
      class="mb-3"
    >
      <BannerCampaigns
        v-if="!inNeedOfConfiguration && !accountHasAtLeastOneCampaign"
        @clickToCreateCampaign="onClickToCreateCampaign"
      />
      <alert-sign-gads-tos
        v-else-if="allDataLoaded && !GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED"
      />

      <key-metrics-controls
        :in-need-of-configuration="inNeedOfConfiguration"
        :loading="!allDataLoaded"
        :accountHasAtLeastOneCampaign="accountHasAtLeastOneCampaign"
        @clickToCreateCampaign="onClickToCreateCampaign"
      />

      <KeyMetricsBlock
        :in-need-of-configuration="inNeedOfConfiguration"
        :loading="!allDataLoaded"
        @clickToCreateCampaign="onClickToCreateCampaign"
      />

      <campaign-table-list
        v-if="!inNeedOfConfiguration"
        :loading="!allDataLoaded"
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </div>
    <!-- Need this new router-view since we now have nested children routes -->
    <router-view  v-else/>
    <TrackingActivationModal
      ref="SSCPopinActivateTrackingCampaignPage"
      modal-id="SSCPopinActivateTrackingCampaignPage"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from "vuex";
import GettersTypesGoogleAds from "@/store/modules/google-ads/getters-types";
import TrackingActivationModal from '@/components/campaigns/tracking-activation-modal.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import BannerCampaigns from '@/components/commons/banner-campaigns.vue';
import CampaignTableList from '@/components/campaign/campaign-table-list.vue';
import KeyMetricsBlock from '@/components/campaign/reporting/key-metrics/key-metrics-block.vue';
import KeyMetricsControls from '@/components/campaign/reporting/key-metrics/key-metrics-controls.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import AlertSignGadsTos from "@/components/enhanced-conversions/alert-sign-gads-tos.vue";

export default defineComponent({
  components: {
    AlertSignGadsTos,
    BannerCampaigns,
    KeyMetricsBlock,
    KeyMetricsControls,
    TrackingActivationModal,
    CampaignTableList,
  },

  data() {
    return {
      allDataLoaded: false,
    };
  },
  computed: {
    ...mapGetters("googleAds", [
      GettersTypesGoogleAds.GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED,
    ]),
    inNeedOfConfiguration() {
      return !this.googleAdsIsServing;
    },
    googleAdsIsServing() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_IS_SERVING'];
    },
    accountHasAtLeastOneCampaign(): boolean {
      return this.$store.getters['campaigns/GET_ACCOUNT_HAS_AT_LEAST_ONE_CAMPAIGN'];
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
});
</script>
