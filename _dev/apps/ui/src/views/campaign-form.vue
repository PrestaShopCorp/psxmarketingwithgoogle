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
      <campaign-creation
        :edit-mode="$route.name === 'campaign-edition' ? true : false"
        @campaignCreated="onCampaignHasBeenCreated"
      />
    </b-skeleton-wrapper>
    <PsToast
      v-if="campaignCreated"
      variant="success"
      @hidden="toastIsClosed"
      :visible="campaignCreated"
      toaster="b-toaster-top-right"
    >
      <p>{{ insideToast }}</p>
    </PsToast>
  </div>
</template>

<script>
import CampaignCreation from '../components/campaign-creation/campaign-creation.vue';
import PsToast from '../components/commons/ps-toast';

export default {
  components: {
    CampaignCreation,
    PsToast,
  },

  data() {
    return {
      campaignCreated: false,
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
    insideToast() {
      if (this.campaignCreated) {
        return this.$t('toast.campaignCreatedSuccess');
      }
      return '';
    },
  },
  methods: {
    onCampaignHasBeenCreated() {
      this.campaignCreated = true;
    },
    toastIsClosed() {
      this.campaignCreated = false;
    },
  },
  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/WARMUP_STORE');
    }
    this.loadingPage = false;
  },
};
</script>
