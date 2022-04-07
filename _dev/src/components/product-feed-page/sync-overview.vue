<template>
  <b-card body-class="p-0">
    <template #header>
      <h1 class="mb-0 ps_gs-onboardingcard__title">
        {{ $t("productFeedSettings.breadcrumb1") }}
      </h1>
    </template>
    <div class="d-md-flex position-relative">
      <div
        v-if="inNeedOfConfiguration"
        class="ps_gs-onboardingcard__not-configured"
      >
        <NotConfiguredCard />
      </div>
      <div class="flex-shrink-0 d-flex flex-column p-3">
        <SyncHistory
          v-slot="{ syncStates }"
          :in-need-of-configuration="inNeedOfConfiguration"
        >
          <SyncState
            v-for="(syncState, i) in syncStates"
            :key="i"
            :sync-state="syncState"
          />
        </SyncHistory>
        <i18n
          v-if="!inNeedOfConfiguration"
          path="cta.visitThe"
          tag="div"
          class="mt-4 ps_gs-fz-13 text-left text-muted"
        >
          <b-link
            :to="{ name: 'help' }"
            class="with-hover text-decoration-underline"
          >
            {{ $t("general.helpPage") }}
          </b-link>
        </i18n>
      </div>
      <div
        class="
          flex-grow-1
          p-3
          border-top border-md-top-0 border-md-left border-600-20
        "
      >
        <SubmittedProducts
          v-slot="{ productStatuses }"
          :in-need-of-configuration="inNeedOfConfiguration"
        >
          <ProductsStatusCard
            v-for="(productStatus, i) in productStatuses"
            :key="i"
            :product-status="productStatus"
          />
        </SubmittedProducts>
        <div class="mt-4 text-muted ps_gs-fz-13 d-flex justify-content-between flex-wrap">
          <a
            :href="$options.googleUrl.learnRequirementsProductSpecification"
            target="_blank"
            class="d-inline-block"
          >{{ $t("cta.googleProductStatusDefinitions") }}</a>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import NotConfiguredCard from '@/components/commons/not-configured-card';
import SubmittedProducts from './submitted-products/submitted-products';
import ProductsStatusCard from './submitted-products/products-status-card';
import SyncHistory from './sync-history/sync-history';
import SyncState from './sync-history/sync-state';
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  components: {
    NotConfiguredCard,
    SubmittedProducts,
    ProductsStatusCard,
    SyncHistory,
    SyncState,
  },
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    validationSummary() {
      return this.$store.getters[
        'productFeed/GET_PRODUCT_FEED_VALIDATION_SUMMARY'
      ];
    },
    productsSent() {
      return (
        this.validationSummary.pendingItems !== null
        || this.validationSummary.activeItems !== null
        || this.validationSummary.expiringItems !== null
        || this.validationSummary.disapprovedItems !== null
      );
    },
  },
  googleUrl,
};
</script>
