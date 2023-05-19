<template>
  <div class="mb-5">
    <div class="d-flex align-items-center mb-2">
      <h2 class="ps_gs-fz-16 font-weight-600">
        {{ $t('productFeedPage.dashboardPage.productsSentToGoogle.stepTitle') }}
      </h2>
      <b-button
        id="tooltip-submitted-product"
        class="ml-1 p-0 d-flex"
        variant="text"
      >
        <span class="material-icons-round ps_gs-fz-20 mb-1 ml-0 text-secondary">
          info_outlined
        </span>
      </b-button>
      <b-tooltip
        target="tooltip-submitted-product"
        triggers="hover"
        container="#psxMktgWithGoogleApp"
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
    validationSummary() {
      return this.inNeedOfConfiguration
        ? {
          activeItems: 0,
          pendingItems: 0,
          disapprovedItems: 0,
          expiringItems: 0,
        }
        : this.$store.getters['productFeed/GET_PRODUCT_FEED_VALIDATION_SUMMARY'];
    },
    productStatuses() {
      return [
        {
          statusOfProducts: 'disapproved',
          numberOfProducts: this.validationSummary.disapprovedItems,
        },
        {
          statusOfProducts: 'pending',
          numberOfProducts: this.validationSummary.pendingItems,
        },
        {
          statusOfProducts: 'expiring',
          numberOfProducts: this.validationSummary.expiringItems,
        },
        {
          statusOfProducts: 'approved',
          numberOfProducts: this.validationSummary.activeItems,
        },
      ];
    },
    statusCards(): StatusCardParameters[] {
      return [{
        title: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.approved'),
        description: this.$t('productFeedPage.dashboardPage.productsSentToGoogle.reportCards.approvedDescription'),
        value: this.validationSummary.activeItems,
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
        value: this.validationSummary.pendingItems,
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
        value: this.validationSummary.expiringItems,
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
        value: this.validationSummary.disapprovedItems,
        variant: 'danger',
        icon: 'cancel',
        reverseColors: false,
        link: {
          to: {name: 'product-feed-status'},
        },
      }];
    },
  },
  created() {
    this.$store.dispatch('productFeed/GET_PREVALIDATION_SUMMARY');
  },
});
</script>
