<template>
  <div>
    <b-skeleton-wrapper
      v-if="$route.name === 'campaign'"
      :loading="loadingPage"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <campaign-card
        @openPopin="onOpenPopinActivateTracking"
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </b-skeleton-wrapper>
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTrackingCampaignPage"
      modal-id="SSCPopinActivateTrackingCampaignPage"
    />
    <!-- Need this new router-view since we now have nested children routes -->
    <router-view />
  </div>
</template>

<script>
import SSCPopinActivateTracking from '../components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue';
import CampaignCard from '../components/smart-shopping-campaigns/campaign-card.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  components: {
    CampaignCard,
    SSCPopinActivateTracking,
  },

  data() {
    return {
      loadingPage: true,
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
      return !!this.$store.getters['smartShoppingCampaigns/GET_ALL_CAMPAIGNS']?.length;
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('smartShoppingCampaigns/WARMUP_STORE');
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
      .then(() => {
        this.loadingPage = false;
        if (this.$route.name === 'campaign' && this.accountHasAtLeastOneCampaign) {
          this.$router.push({
            name: 'campaign-list',
          });
        }
      }).finally(() => {
        this.loadingPage = false;
      });
  },
  watch: {
    $route: {
      handler(route) {
        if (route.name === 'campaign' && this.accountHasAtLeastOneCampaign) {
          this.$router.push({
            name: 'campaign-list',
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  CampaignTypes,
};
</script>
