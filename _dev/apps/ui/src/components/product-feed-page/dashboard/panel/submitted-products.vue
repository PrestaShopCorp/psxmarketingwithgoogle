<template>
  <div class="mb-4">
    <div class="d-flex align-items-center mb-2">
      <h2 class="ps_gs-fz-16 font-weight-600">
        {{ $t('productFeedPage.dashboardPage.productsSentToGoogle.stepTitle') }}
      </h2>
      <b-button
        id="tooltip-submitted-product"
        class="ml-1 p-0 d-flex"
        variant="text"
      >
        <span class="material-icons material-icons-round ps_gs-fz-20 mb-1 ml-0 text-secondary">
          help_outline
        </span>
      </b-button>
      <b-tooltip
        target="tooltip-submitted-product"
        triggers="hover"
        container="#psxMktgWithGoogleApp"
        custom-class="tooltip-xl"
      >
        <VueShowdown
          :markdown="$t('productFeedPage.dashboardPage.productsSentToGoogle.stepDetails')"
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
import {defineComponent} from 'vue';
import StatusCardComponent, {StatusCardParameters} from '../status-card.vue';
import {getMerchantCenterWebsiteUrls} from '@/components/merchant-center-account/merchant-center-account-links';
import {ProductFeedValidationSummary} from '@/store/modules/product-feed/state';

export default defineComponent({
  components: {
    StatusCardComponent,
  },
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    gmcAccountDetails() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    validationSummary(): ProductFeedValidationSummary {
      return this.inNeedOfConfiguration
        ? {
          activeProducts: 0,
          pendingProducts: 0,
          disapprovedProducts: 0,
          expiringProducts: 0,
        }
        : this.$store.getters['productFeed/GET_PRODUCT_FEED_VALIDATION_SUMMARY'];
    },
    productStatuses() {
      return [
        {
          statusOfProducts: 'disapproved',
          numberOfProducts: this.validationSummary.disapprovedProducts,
        },
        {
          statusOfProducts: 'pending',
          numberOfProducts: this.validationSummary.pendingProducts,
        },
        {
          statusOfProducts: 'expiring',
          numberOfProducts: this.validationSummary.expiringProducts,
        },
        {
          statusOfProducts: 'approved',
          numberOfProducts: this.validationSummary.activeProducts,
        },
      ];
    },
    statusCards(): StatusCardParameters[] {
      return [{
        title: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.approved'),
        description: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.approvedDescription'),
        value: this.validationSummary.activeProducts,
        variant: 'primary',
        icon: 'google',
        reverseColors: false,
        link: {
          href: getMerchantCenterWebsiteUrls(this.gmcAccountDetails.id).diagnostics,
          target: '_blank',
        },
      },
      {
        title: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.pending'),
        description: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.pendingDescription'),
        value: this.validationSummary.pendingProducts,
        variant: 'info',
        icon: 'autorenew',
        reverseColors: false,
        link: {
          href: getMerchantCenterWebsiteUrls(this.gmcAccountDetails.id).diagnostics,
          target: '_blank',
        },
      },
      {
        title: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.expiring'),
        description: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.expiringDescription'),
        value: this.validationSummary.expiringProducts,
        variant: 'warning',
        icon: 'warning',
        reverseColors: false,
        link: {
          href: getMerchantCenterWebsiteUrls(this.gmcAccountDetails.id).diagnostics,
          target: '_blank',
        },
      },
      {
        title: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.disapproved'),
        description: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.disapprovedDescription'),
        value: this.validationSummary.disapprovedProducts,
        variant: 'danger',
        icon: 'cancel',
        reverseColors: !!this.validationSummary.disapprovedProducts,
        link: {
          to: {name: 'product-feed-status'},
        },
      }];
    },
  },
  watch: {
    loading(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.$segment.identify(this.$store.state.accounts.shopIdPsAccounts, {
          ggl_user_has_approved_products_on_gmc: !!this.validationSummary.activeProducts,
          ggl_user_has_disapproved_products_on_gmc: !!this.validationSummary.disapprovedProducts,
        });
      }
    },
  },
});
</script>
