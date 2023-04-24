<template>
  <div>
    <product-feed-table-status-details v-if="$route.name === 'product-feed-status'" />
    <product-feed-pre-scan-table-status-details
      v-else-if="$route.path === '/product-feed/pre-scan'"
    />
    <!--
      New routes to implement:
      - product-feed-verification-error-products
      - product-feed-verification-errors

    <component
      v-else-if="$route.name === 'product-feed-verification-error-products'"
    />
    -->
    <template v-else>
      <PsToast
        v-if="allDataLoaded && syncStatus === 'schedule' && !inNeedOfConfiguration"
        variant="warning"
        :visible="syncStatus === 'schedule' && !inNeedOfConfiguration"
        toaster="b-toaster-top-right"
      >
        <p> {{ $t('productFeedPage.alert.alertSuccess') }}</p>
      </PsToast>
      <sync-overview
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </template>
  </div>
</template>

<script>
import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details';
import ProductFeedPreScanTableStatusDetails from '@/components/product-feed-page/product-feed-pre-scan-table-status-details';
import SyncOverview from '@/components/product-feed-page/sync-overview.vue';
import PsToast from '../components/commons/ps-toast';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  data() {
    return {
      allDataLoaded: false,
    };
  },
  components: {
    ProductFeedTableStatusDetails,
    ProductFeedPreScanTableStatusDetails,
    SyncOverview,
    PsToast,
  },
  computed: {
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    inNeedOfConfiguration() {
      // TODO: check if in need of configuration
      return !this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('productFeed/WARMUP_STORE');
    },
  },
  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/WARMUP_STORE');
    }
    this.getDatas().then(() => {
      this.allDataLoaded = true;
    });
  },
  CampaignTypes,
};
</script>
