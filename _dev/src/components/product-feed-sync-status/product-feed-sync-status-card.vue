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
        <b-iconstack
          v-if="syncStatus === 'success'"
          font-scale="1.5"
          class="mr-2"
          width="20"
          height="20"
        >
          <b-icon-circle-fill
            stacked
            class="color-green"
          />
          <b-icon-check
            stacked
            variant="white"
          />
        </b-iconstack>
        <i
          v-if="syncStatus === 'busy'"
          class="mr-2 icon-busy icon-busy--dark d-inline-block"
        />
        <b-icon-exclamation-circle
          v-if="syncStatus === 'error'"
          variant="danger"
          class="mr-2"
        />
        <span>{{ syncStatusMessage }}</span>
      </h4>
      <div class="text-center text-muted ps_gs-fz-12 mb-4">
        <span
          v-if="syncStatus !== 'busy'"
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
      </div>
      <h4 class="font-weight-600 mb-1">
        {{ $t('productFeedPage.syncStatus.prescanTitle') }}
      </h4>
      <p>
        {{ $t('productFeedPage.syncStatus.prescanDescription') }}
      </p>
      <b-container
        fluid
        class="p-0 mb-n1"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-report-products-card
            badge-variant="success"
            :badge-text="$t('badge.readyToSync')"
            :badge-tooltip="'placeholder'"
            :nb-products="nbProductsReadyToSync"
          />
          <product-feed-card-report-products-card
            badge-variant="warning"
            :badge-text="$t('badge.cantSync')"
            :badge-tooltip="'placeholder'"
            :nb-products="nbProductsCantSync"
            :cta-text="$t('cta.whyDidntWork')"
            cta-link="//google.com"
          />
        </b-row>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
  BIconExclamationCircle,
} from 'bootstrap-vue';
import ProductFeedCardReportProductsCard from '../product-feed/product-feed-card-report-products-card';

export default {
  name: 'ProductFeedSyncStatusCard',
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationCircle,
    ProductFeedCardReportProductsCard,
  },
  props: {
    syncStatus: {
      type: String,
      default: null,
      validator(value) {
        return [null, 'success', 'warning', 'error', 'busy'].indexOf(value) !== -1;
      },
    },
    nbProductsReadyToSync: {
      type: Number,
    },
    nbProductsCantSync: {
      type: Number,
    },
    nextSyncTime: {
      type: String,
    },
    lastSyncTime: {
      type: String,
    },
  },
  computed: {
    syncStatusMessage() {
      let message;
      switch (this.syncStatus) {
        case null:
          break;
        case 'busy':
          message = this.$i18n.t('productFeedPage.syncStatus.syncProcessing');
          break;
        case 'error':
          message = this.$i18n.t('productFeedPage.syncStatus.syncFailed');
          break;
        case 'success':
          message = this.$i18n.t('productFeedPage.syncStatus.syncProcessed');
          break;
        default:
          break;
      }
      return message;
    },
  },
};
</script>
