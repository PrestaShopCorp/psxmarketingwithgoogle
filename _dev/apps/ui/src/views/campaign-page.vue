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
      <campaign-table-list
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
import CampaignTableList from '@/components/campaign/campaign-table-list.vue'

export default {
  components: {
    CampaignTableList,
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
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('campaigns/WARMUP_STORE');
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
