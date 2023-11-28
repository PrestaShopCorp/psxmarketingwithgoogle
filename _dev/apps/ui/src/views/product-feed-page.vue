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
    <product-feed-dashboard-page
      v-else
      :in-need-of-configuration="inNeedOfConfiguration"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details.vue';
import NonCompliantProductsPage from '@/components/product-feed-page/non-compliant-products-page/non-compliant-products-page.vue';
import NonCompliantProductsDetailsPage from '@/components/product-feed-page/non-compliant-products-details-page/non-compliant-products-details-page.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import ProductFeedDashboardPage from '@/components/product-feed-page/dashboard/product-feed-dashboard-page.vue';

export default defineComponent({
  components: {
    ProductFeedDashboardPage,
    ProductFeedTableStatusDetails,
    NonCompliantProductsPage,
    NonCompliantProductsDetailsPage,
  },
  computed: {
    inNeedOfConfiguration() {
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
    await this.getDatas();
  },
  CampaignTypes,
});
</script>
