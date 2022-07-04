<template>
  <div>
    <b-skeleton-wrapper
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
      <smart-shopping-campaign-table-list
        :loading="loadingCampaignList"
        @loader="changeLoadingState($event)"
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </b-skeleton-wrapper>
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTrackingList"
      modal-id="SSCPopinActivateTrackingList"
    />
  </div>
</template>

<script>
import SSCPopinActivateTracking from '../components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue';
import SmartShoppingCampaignTableList from '../components/smart-shopping-campaign/smart-shopping-campaign-table-list.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  components: {
    SSCPopinActivateTracking,
    SmartShoppingCampaignTableList,
  },

  data() {
    return {
      loadingCampaignList: true,
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
        this.$refs.SSCPopinActivateTrackingList.$refs.modal.id,
      );
    },
    changeLoadingState(event) {
      this.loadingCampaignList = event;
    },
  },
  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/WARMUP_STORE');
    }
    // Not dispatch if there already are campaigns in the store
    if (!this.accountHasAtLeastOneCampaign) {
      this.getDatas()
        .then(() => {
          this.loadingPage = false;
        });
    } else {
      this.loadingPage = false;
    }
  },
  CampaignTypes,
};
</script>
