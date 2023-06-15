<template>
  <div>
    <product-feed-table-status-details v-if="$route.name === 'product-feed-status'" />
    <product-feed-pre-scan-table-status-details
      v-else-if="$route.path === '/product-feed/pre-scan'"
    />
    <non-compliant-products-details-page
      v-else-if="$route.name === 'product-feed-verification-error-products'"
      :verification-issue-name="$route.params.error"
    />
    <non-compliant-products-page
      v-else-if="$route.name === 'product-feed-verification-errors'"
    />
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
        :loading="!allDataLoaded"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details.vue';
import SyncOverview from '@/components/product-feed-page/dashboard/sync-overview.vue';
import NonCompliantProductsPage from '@/components/product-feed-page/non-compliant-products-page/non-compliant-products-page.vue';
import NonCompliantProductsDetailsPage from '@/components/product-feed-page/non-compliant-products-details-page/non-compliant-products-details-page.vue';
import PsToast from '@/components/commons/ps-toast.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default defineComponent({
  data() {
    return {
      allDataLoaded: false,
    };
  },
  components: {
    ProductFeedTableStatusDetails,
    NonCompliantProductsPage,
    NonCompliantProductsDetailsPage,
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
});
</script>
