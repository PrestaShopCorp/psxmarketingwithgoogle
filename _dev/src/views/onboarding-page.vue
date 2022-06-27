<template>
  <div class="pt-2">
    <section-title
      :step-number="1"
      :step-title="$t('onboarding.sectionTitle.psAccount')"
      :is-enabled="true"
      :is-done="stepsAreCompleted.step1"
    />
    <ps-accounts
      class="ps_gs-ps-account-card"
      :context="psAccountsContext"
    />
    <template v-if="psAccountsContext.isShopContext">
      <section-title
        :step-number="2"
        :step-title="$t('onboarding.sectionTitle.freeListing')"
        :is-enabled="stepsAreCompleted.step1"
        :is-done="stepsAreCompleted.step2"
      />
      <ProductFeedNotice
        v-if="stepsAreCompleted.step1"
      />
      <google-account-card
        :is-enabled="stepsAreCompleted.step1"
        :loading="googleIsLoading"
        :user="getGoogleAccount"
        :is-connected="googleAccountIsOnboarded"
        @connectGoogleAccount="onGoogleAccountConnection"
        @dissociateGoogleAccount="onGoogleAccountDissociationRequest"
      />
      <MerchantCenterAccountCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="googleAccountIsOnboarded"
        :is-connected="merchantCenterAccountIsChosen"
        :loading="MCAIsLoading"
        :is-e-u="showCSSForMCA"
        :is-linking="isMcaLinking"
        @selectMerchantCenterAccount="onMerchantCenterAccountSelected($event)"
        @dissociateMerchantCenterAccount="onMerchantCenterAccountDissociationRequest"
        @phoneNumberHasBeenVerified="onPhoneNumberVerified"
      />
      <ProductFeedCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="merchantCenterAccountIsChosen"
        :loading="productFeedIsLoading"
      />

      <FreeListingCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="productFeedIsConfigured"
        :loading="freeListingIsLoading"
        :error-a-p-i="false"
        @openPopin="togglePopinFreeListingDisabled"
      />
      <section-title
        :step-number="3"
        :step-title="$t('onboarding.sectionTitle.smartShoppingCampaign')"
        :is-enabled="stepsAreCompleted.step2"
        :is-done="stepsAreCompleted.step3"
        badge
      />
      <GoogleAdsAccountCard
        :is-enabled="stepsAreCompleted.step2"
        :loading="googleAdsIsLoading"
        @selectGoogleAdsAccount="onGoogleAdsAccountSelected()"
        @disconnectionGoogleAdsAccount="onGoogleAdsAccountDisconnectionRequest"
        @creationGoogleAdsAccount="onGoogleAdsAccountTogglePopin"
      />
      <SmartShoppingCampaignCard
        v-if="stepsAreCompleted.step2"
        :is-enabled="stepsAreCompleted.step3"
        :loading="SSCIsLoading"
        @openPopin="onOpenPopinActivateTracking"
        @remarketingTagHasBeenActivated="checkAndOpenPopinConfigrationDone"
      />
    </template>
    <!-- Modals -->
    <GoogleAccountPopinDisconnect
      ref="googleAccountDisconnectModal"
    />

    <MerchantCenterAccountPopinDisconnect
      ref="mcaDisconnectModal"
    />

    <FreeListingPopinDisable
      ref="PopinFreeListingDisable"
    />

    <GoogleAdsAccountPopinDisconnect
      ref="GoogleAdsAccountPopinDisconnect"
    />

    <GoogleAdsPopinNew
      ref="GoogleAdsAccountPopinNew"
      :user="getGoogleAccount"
      @cancelGoogleAdsCreationNewAccount="onGoogleAdsAccountTogglePopin"
    />
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTrackingOnboardingPage"
      modal-id="SSCPopinActivateTrackingOnboardingPage"
    />
    <PopinModuleConfigured
      ref="PopinModuleConfigured"
      @openPopinRemarketingTag="onOpenPopinActivateTracking"
    />
    <PmaxDiscoverModal
      :visible="!merchantHasAlreadySeenPmaxPopin"
      :type="PmaxModalType.PMAX_RELEASED"
      ref="PmaxDiscoverModal"
    />
    <!-- Toasts -->
    <PsToast
      v-if="toastIsVisible"
      variant="success"
      @hidden="toastIsClosed"
      :visible="toastIsVisible"
      toaster="b-toaster-top-right"
    >
      <p>{{ insideToast }}</p>
    </PsToast>
  </div>
</template>

<script>
import {PsAccounts} from 'prestashop_accounts_vue_components';
import SectionTitle from '../components/onboarding/section-title';
import GoogleAccountCard from '../components/google-account/google-account-card';
import GoogleAdsAccountCard from '../components/google-ads-account/google-ads-account-card';
import ProductFeedNotice from '../components/onboarding/product-feed-notice.vue';
import MerchantCenterAccountCard from '../components/merchant-center-account/merchant-center-account-card.vue';
import ProductFeedCard from '../components/product-feed/product-feed-card.vue';
import FreeListingPopinDisable from '../components/free-listing/free-listing-popin-disable.vue';
import FreeListingCard from '../components/free-listing/free-listing-card.vue';
import GoogleAccountPopinDisconnect from '../components/google-account/google-account-popin-disconnect.vue';
import MerchantCenterAccountPopinDisconnect from '../components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import GoogleAdsAccountPopinDisconnect from '../components/google-ads-account/google-ads-account-popin-disconnect.vue';
import GoogleAdsPopinNew from '../components/google-ads-account/google-ads-account-popin-new.vue';
import SmartShoppingCampaignCard from '../components/smart-shopping-campaigns/smart-shopping-campaign-card.vue';
import SSCPopinActivateTracking from '../components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue';
import PmaxDiscoverModal from '../components/pmax/pmax-integration-modals/pmax-discover-modal.vue';
import PsToast from '../components/commons/ps-toast';
import PopinModuleConfigured from '../components/commons/popin-configured.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import PmaxModalType from '../enums/pmax/pmax-modal';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  name: 'OnboardingPage',
  components: {
    PsAccounts,
    SectionTitle,
    GoogleAccountCard,
    GoogleAdsAccountCard,
    ProductFeedNotice,
    MerchantCenterAccountCard,
    ProductFeedCard,
    FreeListingCard,
    SmartShoppingCampaignCard,
    GoogleAccountPopinDisconnect,
    MerchantCenterAccountPopinDisconnect,
    GoogleAdsAccountPopinDisconnect,
    GoogleAdsPopinNew,
    PsToast,
    FreeListingPopinDisable,
    SSCPopinActivateTracking,
    PmaxDiscoverModal,
    PopinModuleConfigured,
  },
  data() {
    return {
      isMcaLinking: false,
      googleAdsIsLoading: false,
      googleIsLoading: false,
      MCAIsLoading: false,
      productFeedIsLoading: false,
      freeListingIsLoading: false,
      SSCIsLoading: false,
      phoneNumberVerified: false,
      PmaxModalType,
    };
  },
  methods: {
    onMerchantCenterAccountSelected(selectedAccount) {
      this.isMcaLinking = true;
      const correlationId = `${Math.floor(Date.now() / 1000)}`;
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT', {selectedAccount, correlationId})
        // must wait before to ask for status
        .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => {
          this.$store.dispatch('accounts/TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS', correlationId);
        })
        .finally(() => {
          this.isMcaLinking = false;
          this.$store.commit('accounts/SAVE_MCA_CONNECTED_ONCE', true);
        });
    },
    checkAndOpenPopinConfigrationDone() {
      if (this.billingSettingsCompleted) {
        this.$bvModal.show(
          this.$refs.PopinModuleConfigured.$refs.modal.id,
        );
      }
    },
    onGoogleAdsAccountSelected() {
      this.$store.commit('googleAds/SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE', true);
      this.checkAndOpenPopinConfigrationDone();
    },
    onGoogleAccountConnection() {
      this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', true);
      this.$store.dispatch('accounts/TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED', true);
    },

    onGoogleAccountDissociationRequest() {
      this.$bvModal.show(
        this.$refs.googleAccountDisconnectModal.$refs.modal.id,
      );
    },
    onMerchantCenterAccountDissociationRequest() {
      this.$bvModal.show(
        this.$refs.mcaDisconnectModal.$refs.modal.id,
      );
    },
    onPhoneNumberVerified() {
      this.phoneNumberVerified = true;
    },
    onGoogleAdsAccountDisconnectionRequest() {
      this.$store.commit('googleAds/SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE', false);
      this.$bvModal.show(
        this.$refs.GoogleAdsAccountPopinDisconnect.$refs.modal.id,
      );
    },
    onGoogleAdsAccountTogglePopin() {
      this.$bvModal.show(
        this.$refs.GoogleAdsAccountPopinNew.$refs.modal.id,
      );
    },
    onOpenPopinActivateTracking() {
      this.$bvModal.show(
        this.$refs.SSCPopinActivateTrackingOnboardingPage.$refs.modal.id,
      );
    },
    toastIsClosed() {
      if (this.googleAccountConnectedOnce) {
        this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', false);
      } else if (this.merchantCenterAccountConnectedOnce) {
        this.$store.commit('accounts/SAVE_MCA_CONNECTED_ONCE', false);
      } else if (this.productFeedIsConfiguredOnce) {
        this.$store.commit('productFeed/SAVE_CONFIGURATION_CONNECTED_ONCE', false);
      } else if (this.freeListingIsActivatedOnce) {
        this.$store.commit('freeListing/SAVE_ACTIVATED_ONCE', false);
      } else if (this.googleAdsAccountConnectedOnce) {
        this.$store.commit('googleAds/SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE', false);
      } else if (this.phoneNumberVerified) {
        this.phoneNumberVerified = false;
      }
    },
    togglePopinFreeListingDisabled() {
      if (this.$refs.PopinFreeListingDisable) {
        this.$bvModal.show(
          this.$refs.PopinFreeListingDisable.$refs.modal.id,
        );
      }
    },
    triggerLoadOfGoogleAdsAccount() {
      this.googleAdsIsLoading = true;
      this.freeListingIsLoading = true;
      this.$store.dispatch('freeListing/GET_FREE_LISTING_STATUS').finally(() => {
        this.freeListingIsLoading = false;
      });
      this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST').then(() => this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT')
        .finally(() => {
          this.googleAdsIsLoading = false;
        }));
    },
  },
  computed: {
    psAccountsContext() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT'];
    },
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
    psAccountsIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
    googleAccountIsOnboarded() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_IS_ONBOARDED'];
    },
    getGoogleAccount() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT'];
    },
    googleAccountConnectedOnce() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_CONNECTED_ONCE'];
    },
    merchantCenterAccountIsChosen() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
    merchantCenterAccountConnectedOnce() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_CONNECTED_ONCE']
      && !this.$store.state.accounts.googleMerchantAccount.connectedAutomatically;
    },
    productFeedIsConfiguredOnce() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED_ONCE'];
    },
    freeListingIsActivatedOnce() {
      return this.$store.getters['freeListing/GET_FREE_LISTING_IS_ACTIVATED_ONCE'];
    },
    googleAdsAccountConnectedOnce() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE'];
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
    merchantHasAlreadySeenPmaxPopin() {
      return getDataFromLocalStorage(`modalPmax-${PmaxModalType.PMAX_RELEASED}`);
    },
    toastIsVisible() {
      return this.googleAccountConnectedOnce
        || this.merchantCenterAccountConnectedOnce
        || this.productFeedIsConfiguredOnce
        || this.freeListingIsActivatedOnce
        || (this.googleAdsAccountConnectedOnce
            && this.billingSettingsCompleted)
        || this.phoneNumberVerified;
    },
    showCSSForMCA() {
      return this.$store.getters['app/GET_IS_COUNTRY_MEMBER_OF_EU'];
    },
    productFeedIsConfigured() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
    stepsAreCompleted() {
      return {
        step1: this.psAccountsIsOnboarded,
        step2: this.googleAccountIsOnboarded
          && this.merchantCenterAccountIsChosen
          && this.productFeedIsConfigured,
        step3: this.productFeedIsConfigured
        && this.googleAdsAccountIsChosen
        && this.billingSettingsCompleted,
      };
    },
    insideToast() {
      if (this.googleAccountConnectedOnce) {
        return this.$t('toast.googleAccountConnectedOnceSuccess');
      } if (this.merchantCenterAccountConnectedOnce) {
        return this.$t('toast.MCAConnectedOnceSuccess');
      } if (this.productFeedIsConfiguredOnce) {
        return this.$t('toast.productFeedConfiguredOnceSuccess');
      } if (this.freeListingIsActivatedOnce) {
        return this.$t('toast.alertActivationSuccess');
      } if (this.googleAdsAccountConnectedOnce) {
        return this.$t('toast.alertGoogleAdsAccountSuccess');
      } if (this.phoneNumberVerified) {
        return this.$t('toast.phoneNumberVerifiedSuccess');
      }
      return '';
    },
  },
  mounted() {
    // Try to retrieve Google account details. If the merchant is not onboarded,
    // this action will dispatch another one to generate the authentication route.
    // We do it if the state is empty
    if (this.psAccountsIsOnboarded === true && !this.googleAccountIsOnboarded) {
      this.googleIsLoading = true;
      this.MCAIsLoading = true;
      this.$store.dispatch('accounts/REQUEST_GOOGLE_ACCOUNT_DETAILS').then(() => {
        if (!this.googleAccountIsOnboarded) {
          this.$segment.track('[GGL] PS Account connected', {
            module: 'psxmarketingwithgoogle',
            params: SegmentGenericParams,
          });
        }
      }).finally(() => {
        this.googleIsLoading = false;
        this.MCAIsLoading = false;
      });
    }
    if (this.productFeedIsConfigured) {
      this.triggerLoadOfGoogleAdsAccount();
    }
  },
  beforeDestroy() {
    this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', false);
    this.$store.commit('accounts/SAVE_MCA_CONNECTED_ONCE', false);
    this.$store.commit('productFeed/SAVE_CONFIGURATION_CONNECTED_ONCE', false);
    this.$store.commit('freeListing/SAVE_ACTIVATED_ONCE', false);
    this.$store.commit('googleAds/SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE', false);
  },
  watch: {
    merchantCenterAccountIsChosen(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.productFeedIsLoading = true;
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
        this.$store.dispatch('productFeed/REQUEST_ATTRIBUTE_MAPPING');
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS').finally(() => {
          this.productFeedIsLoading = false;
        });
      }
    },
    productFeedIsConfigured(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.triggerLoadOfGoogleAdsAccount();
      }
    },
    googleAdsAccountIsChosen(newVal, oldVal) {
      if (oldVal === null && newVal === true) {
        this.SSCIsLoading = true;
        this.$store.dispatch('smartShoppingCampaigns/GET_CAMPAIGNS_LIST', {isNewRequest: true, typeChosen: this.$options.CampaignTypes.PERFORMANCE_MAX}).finally(() => {
          this.SSCIsLoading = false;
        });
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED');
      }
    },

  },
  CampaignTypes,
};
</script>
