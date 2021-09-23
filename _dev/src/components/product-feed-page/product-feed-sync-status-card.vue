<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard px-0"
  >
    <b-card-header
      header-tag="h3"
      header-class="px-3 py-3 font-weight-600 ps_gs-fz-16"
    >
      {{ $t('productFeedPage.syncStatus.title') }}
    </b-card-header>
    <b-card-body
      body-class="p-3"
    >
      <h4 class="d-flex align-items-center justify-content-center font-weight-600 ps_gs-fz-20 mb-2">
        <i
          class="material-icons ps_gs-fz-20 mr-2"
          :class="`text-${title.color}`"
        >
          {{ title.icon }}
        </i>
        <span>{{ title.message }}</span>
      </h4>
      <div class="text-center text-muted ps_gs-fz-12 pb-3">
        <template
          v-if="syncStatus === 'schedule'"
        >
          {{ $t('productFeedPage.syncStatus.scheduleOn', [nextSyncTime]) }}
        </template>
        <template
          v-else
        >
          <span
            class="d-inline-block mx-2"
          >
            {{ $t('productFeedPage.syncStatus.lastSync', [lastSyncTime]) }}
          </span>
          <span class="d-inline-block mx-2">
            {{ $t('productFeedPage.syncStatus.nextSync', [nextSyncTime]) }}
          </span>
          <b-button
            v-if="syncStatus === 'error'"
            variant="primary"
            class="d-block mx-auto mt-3"
          >
            <span class="material-icons">
              autorenew
            </span>
            {{ $t('cta.forceSync') }}
          </b-button>
        </template>
      </div>
      <b-alert
        variant="warning"
        class="mt-2 mb-0"
        :show="syncStatus === 'failed'"
      >
        <VueShowdown
          :markdown="$t('productFeedPage.syncStatus.alert',
                        [$options.googleUrl.syncFailed])"
          :extensions="['extended-link']"
        />
      </b-alert>
      <!-- NOT IN BATCH 1 -->
      <!-- TODO: readjust margin in batch 2 -->
      <!-- <h4 class="font-weight-600 mb-1 mt-4">
        {{ $t('productFeedPage.syncStatus.prescanTitle') }}
      </h4>
      <b-container
        fluid
        class="p-0 mb-n1"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-report-products-card
            status="success"
            :title="$t('productFeedCard.productsReadyToBeSynced')"
            :nb-products="nbProductsReadyToSync"
            :sync-status="syncStatus"
          />
          <product-feed-card-report-products-card
            status="warning"
            :title="$t('productFeedCard.productsWithProblems')"
            :nb-products="nbProductsCantSync"
            :sync-status="syncStatus"
            :link="$t('cta.reviewProblems')"
            link-to="#"
          />
        </b-row>
      </b-container> -->
    </b-card-body>
  </b-card>
</template>

<script>
/**
 * ! BE CAREFUL
 * ! Prescan is out of scope for batch 1
 */
import googleUrl from '@/assets/json/googleUrl.json';

/**
 * ! Prescan is out of scope for batch 1
 * ! ProductFeedCardReportProductsCard
 */
//  import ProductFeedCardReportProductsCard
//  from '../product-feed/product-feed-card-report-products-card';

export default {
  name: 'ProductFeedSyncStatusCard',
  components: {
    // ProductFeedCardReportProductsCard,
  },

  computed: {
    getProductFeedStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    nbProductsReadyToSync() {
      return this.$store.state.productFeed.totalProducts;
    },
    allValidationSummary() {
      return this.$store.state.productFeed.validationSummary;
    },
    nbProductsCantSync() {
      return this.allValidationSummary.disapprovedItems;
    },
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    title() {
      if (this.syncStatus === 'schedule') {
        return {
          icon: 'schedule',
          color: 'primary',
          message: this.$i18n.t('productFeedPage.syncStatus.readyForExport'),
        };
      }
      if (this.syncStatus === 'failed') {
        return {
          icon: 'info_outlined',
          color: 'danger',
          message: this.$i18n.t('productFeedPage.syncStatus.syncFailed'),
        };
      }
      return {
        icon: 'check_circle',
        color: 'success',
        message: this.$i18n.t('productFeedPage.syncStatus.syncProcessed'),
      };
    },
    nextSyncTime() {
      return this.$options.filters.timeConverterToDate(this.getProductFeedStatus.nextJobAt);
    },
    lastSyncTime() {
      return this.$options.filters.timeConverterToDate(this.getProductFeedStatus.lastUpdatedAt);
    },

  },
  googleUrl,
};
</script>
