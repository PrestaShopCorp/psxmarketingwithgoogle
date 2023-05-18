<template>
  <div>
    <div class="d-flex align-items-center mb-2">
      <h2 class="ps_gs-fz-16 font-weight-600">
        {{ $t('productFeedPage.dashboardPage.productVerification.stepTitle') }}
      </h2>
      <b-button
        id="tooltip-verified-product"
        class="ml-1 p-0 d-flex"
        variant="text"
      >
        <span class="material-icons-round ps_gs-fz-20 mb-1 ml-0 text-secondary">
          info_outlined
        </span>
      </b-button>
      <b-tooltip
        target="tooltip-verified-product"
        triggers="hover"
        container="#psxMktgWithGoogleApp"
      >
        <VueShowdown
          :markdown="$t('productFeedPage.dashboardPage.productVerification.stepDetails')"
        />
      </b-tooltip>
    </div>
    <div class="p-0 container-fluid">
      <div class="row mx-n1 no-gutters mb-3">
        <status-card-component
          v-for="(status, index) in statusCards"
          :key="index"
          :status="status"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';
import {VueShowdown} from 'vue-showdown';
import StatusCardComponent from './verified-products-status-card.vue';
import {StatusCard, VerificationStats} from './verified-products';

export default defineComponent({
  components: {
    StatusCardComponent,
    VueShowdown,
  },
  props: {
    verificationsStats: {
      type: [Object, null] as PropType<VerificationStats>,
      required: false,
      default: null,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    statusCards(): StatusCard[] {
      return [{
        title: this.$t('productFeedPage.dashboardPage.productVerification.reportCards.productsInCatalog'),
        description: this.$t('productFeedPage.dashboardPage.productVerification.reportCards.productsInCatalogDescription'),
        value: this.verificationsStats?.productsInCatalog,
        variant: 'info',
        icon: 'redeem',
        reverseColors: false,
      },
      {
        title: this.$t('productFeedPage.dashboardPage.productVerification.reportCards.verified'),
        description: this.$t('productFeedPage.dashboardPage.productVerification.reportCards.verifiedDescription'),
        value: this.verificationsStats?.verifiedProducts,
        variant: 'success',
        icon: 'send',
        reverseColors: false,
      },
      {
        title: this.$t('productFeedPage.dashboardPage.productVerification.reportCards.nonCompliant'),
        description: this.$t('productFeedPage.dashboardPage.productVerification.reportCards.nonCompliantDescription'),
        value: this.verificationsStats?.nonCompliantProducts,
        variant: 'danger',
        icon: 'remove_shopping_cart',
        reverseColors: false,
        ...(+(this.verificationsStats?.nonCompliantProducts || 0) && {
          link: {
            to: {name: 'product-feed-verification-errors'},
          },
          reverseColors: true,
        }),
      },
      ];
    },
  },
});
</script>
