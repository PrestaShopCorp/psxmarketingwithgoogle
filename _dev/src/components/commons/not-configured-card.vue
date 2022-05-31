<template>
  <b-card
    class="mb-2 maxw-sm-320 shadow-sm border-0"
  >
    <b-card-body
      align="center"
    >
      <h3
        class="font-weight-600"
      >
        {{ titleNotConfigured }}
      </h3>
      <img
        src="@/assets/images/coaching.svg"
        alt=""
      >
      <p>
        {{ textNotConfigured }}
      </p>
      <b-button
        :to="{name: 'configuration'}"
        variant="primary"
        class="text-wrap"
      >
        {{ ctaNotConfigured }}
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  computed: {
    psAccountsIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
    googleAccountIsOnboarded() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_IS_ONBOARDED'];
    },
    merchantCenterAccountIsChosen() {
      return this.$store.state.accounts.googleMerchantAccount.isVerified;
    },
    productFeedIsConfigured() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
    getGoogleAdsAccount() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    googleAdsAccountIsChosen() {
      return this.getGoogleAdsAccount && this.getGoogleAdsAccount.id.length > 0;
    },
    billingSettingsCompleted() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_IS_SERVING'];
    },
    textNotConfigured() {
      if (!this.googleAccountIsOnboarded) {
        return this.$i18n.t('notConfiguredState.textGoogleMissing');
      }
      if (this.googleAccountIsOnboarded && !this.productFeedIsConfigured) {
        return this.$i18n.t('notConfiguredState.textOneMoreThing');
      }
      if (this.productFeedIsConfigured && !this.googleAdsAccountIsChosen) {
        return this.$i18n.t('notConfiguredState.textBoostYourSales');
      }
      return null;
    },
    titleNotConfigured() {
      if (this.productFeedIsConfigured && !this.googleAdsAccountIsChosen) {
        return this.$i18n.t('notConfiguredState.titleOneLastStep');
      }
      return this.$i18n.t('notConfiguredState.title');
    },
    ctaNotConfigured() {
      if (!this.googleAccountIsOnboarded) {
        return this.$i18n.t('notConfiguredState.ctaClassic');
      }
      if (this.googleAccountIsOnboarded && !this.merchantCenterAccountIsChosen) {
        return this.$i18n.t('notConfiguredState.ctaLinkMCA');
      }
      if (this.merchantCenterAccountIsChosen && !this.productFeedIsConfigured) {
        return this.$i18n.t('notConfiguredState.ctaExportFeed');
      }
      if (this.productFeedIsConfigured && !this.googleAdsAccountIsChosen) {
        return this.$i18n.t('notConfiguredState.ctaLinkGoogleAds');
      }
      return this.$i18n.t('notConfiguredState.ctaClassic');
    },
  },

};
</script>
