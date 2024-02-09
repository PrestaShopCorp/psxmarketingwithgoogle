<template>
  <div class="pt-2 container ps_gs-onboardingpage">
    
    <onboarding-deps-container
      :ps-accounts-onboarded="psAccountsIsOnboarded"
      :billing-running="GET_BILLING_SUBSCRIPTION_ACTIVE"
      :steps-are-completed="stepsAreCompleted.step1"
      @onCloudsyncConsentUpdated="cloudSyncSharingConsentGiven = $event"
    />

    <two-panel-cols
      :title="$t('onboarding.sectionTitle.freeListing.title')"
      :description="$t('onboarding.sectionTitle.freeListing.subtitle')"
    >
      <google-account-card
        :is-enabled="stepsAreCompleted.step1"
        :loading="googleIsLoading"
        :user="getGoogleAccount"
        :is-connected="googleAccountIsOnboarded"
        @connectGoogleAccount="onGoogleAccountConnection"
        @dissociateGoogleAccount="onGoogleAccountDissociationRequest"
      />
      <MerchantCenterAccountCard
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
        :is-enabled="merchantCenterAccountIsChosen"
        :loading="productFeedIsLoading"
      />
    </two-panel-cols>

    <two-panel-cols
      :title="$t('onboarding.sectionTitle.smartShoppingCampaign.title')"
      :description="$t('onboarding.sectionTitle.smartShoppingCampaign.subtitle')"
    >
      <GoogleAdsAccountCard
        :is-enabled="stepsAreCompleted.step2"
        :loading="googleAdsIsLoading"
        @selectGoogleAdsAccount="onGoogleAdsAccountSelected()"
        @disconnectionGoogleAdsAccount="onGoogleAdsAccountDisconnectionRequest"
        @creationGoogleAdsAccount="onGoogleAdsAccountTogglePopin"
      />
      <CampaignCard
        v-if="stepsAreCompleted.step2"
        :is-enabled="stepsAreCompleted.step3"
        :loading="SSCIsLoading"
        @openPopin="proceedToCampaignCreation"
        @remarketingTagHasBeenActivated="checkAndOpenPopinConfigrationDone"
      />
      <CampaignTracking
        v-if="remarketingTagIsSet !== null && accountHasAtLeastOneCampaign"
      />
      <CampaignTracking
        v-if="remarketingTagIsSet !== null && accountHasAtLeastOneCampaign"
      />
      <EnhancedConversionsCard
        v-if="remarketingTagIsSet !== null && accountHasAtLeastOneCampaign"
      />
      <PromoCard />
    </two-panel-cols>

    <!-- Modals -->
    <GoogleAccountPopinDisconnect
      ref="googleAccountDisconnectModal"
    />

    <MerchantCenterAccountPopinDisconnect
      ref="mcaDisconnectModal"
    />

    <GoogleAdsAccountPopinDisconnect
      ref="GoogleAdsAccountPopinDisconnect"
    />

    <GoogleAdsPopinNew
      ref="GoogleAdsAccountPopinNew"
      :user="getGoogleAccount"
      @cancelGoogleAdsCreationNewAccount="onGoogleAdsAccountTogglePopin"
    />
    <TrackingActivationModal
      ref="SSCPopinActivateTrackingOnboardingPage"
      modal-id="SSCPopinActivateTrackingOnboardingPage"
    />
    <modal-ec-intro
      v-if="GET_FEATURE_FLAG_ENHANCED_CONVERSIONS
        && getGoogleAdsAccount
        && accountHasAtLeastOneCampaign
        && enhancedConversionsHasNeverBeenEnabled"
      :tos-are-signed="!!getGoogleAdsAccount.acceptedCustomerDataTerms"
    />
    <PopinModuleConfigured
      ref="PopinModuleConfigured"
      @openPopinRemarketingTag="proceedToCampaignCreation"
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

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import SectionTitle from '@/components/onboarding/section-title.vue';
import GoogleAccountCard from '@/components/google-account/google-account-card.vue';
import GoogleAdsAccountCard from '@/components/google-ads-account/google-ads-account-card.vue';
import MerchantCenterAccountCard from '@/components/merchant-center-account/merchant-center-account-card.vue';
import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
import GoogleAccountPopinDisconnect from '@/components/google-account/google-account-popin-disconnect.vue';
import MerchantCenterAccountPopinDisconnect from '@/components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import GoogleAdsAccountPopinDisconnect from '@/components/google-ads-account/google-ads-account-popin-disconnect.vue';
import GoogleAdsPopinNew from '@/components/google-ads-account/google-ads-account-popin-new.vue';
import CampaignCard from '@/components/campaigns/campaign-card.vue';
import CampaignTracking from '@/components/campaigns/campaign-tracking.vue';
import OnboardingDepsContainer from '@/components/onboarding/onboarding-deps-container.vue';
import PromoCard from '@/components/promo/promo-card.vue';
import TrackingActivationModal from '@/components/campaigns/tracking-activation-modal.vue';
import PsToast from '@/components/commons/ps-toast.vue';
import PopinModuleConfigured from '@/components/commons/popin-configured.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import EnhancedConversionsCard from '@/components/enhanced-conversions/enhanced-conversions-card.vue';
import ModalEcIntro from '@/components/enhanced-conversions/modal-ec-intro.vue';
import {AccountInformations} from '@/store/modules/google-ads/state';
import GettersTypesApp from '@/store/modules/app/getters-types';
import TwoPanelCols from '@/components/onboarding/two-panel-cols.vue';

export default defineComponent({
  name: 'OnboardingPage',
  components: {
    SectionTitle,
    EnhancedConversionsCard,
    GoogleAccountCard,
    GoogleAdsAccountCard,
    MerchantCenterAccountCard,
    OnboardingDepsContainer,
    ProductFeedCard,
    CampaignCard,
    CampaignTracking,
    PromoCard,
    GoogleAccountPopinDisconnect,
    MerchantCenterAccountPopinDisconnect,
    ModalEcIntro,
    GoogleAdsAccountPopinDisconnect,
    GoogleAdsPopinNew,
    PsToast,
    TrackingActivationModal,
    PopinModuleConfigured,
    TwoPanelCols,
  },
  data() {
    return {
      isMcaLinking: false,
      googleAdsIsLoading: false,
      googleIsLoading: false,
      MCAIsLoading: false,
      productFeedIsLoading: false,
      SSCIsLoading: false,
      phoneNumberVerified: false,
      cloudSyncSharingConsentScreenStarted: false,
      cloudSyncSharingConsentGiven: false,
    };
  },
  methods: {
    onMerchantCenterAccountSelected(selectedAccount) {
      this.isMcaLinking = true;
      const correlationId = `${Math.floor(Date.now() / 1000)}`;
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT', {selectedAccount, correlationId})
        // must wait before to ask for status
        .then(() => new Promise((resolve) => { setTimeout(resolve, 1000); }))
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
      this.$store.dispatch('app/TRIGGER_REGISTER_HOOKS');
      this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', true);
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
    proceedToCampaignCreation() {
      // If the remarketing tag is not set yet, open the modal
      if (!this.accountHasAtLeastOneCampaign || !this.remarketingTagIsSet) {
        this.$bvModal.show(
          this.$refs.SSCPopinActivateTrackingOnboardingPage.$refs.modal.id,
        );
        return;
      }
      this.$router.push({
        name: 'campaign-creation',
      });
    },
    toastIsClosed() {
      if (this.googleAccountConnectedOnce) {
        this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', false);
      } else if (this.merchantCenterAccountConnectedOnce) {
        this.$store.commit('accounts/SAVE_MCA_CONNECTED_ONCE', false);
      } else if (this.productFeedIsConfiguredOnce) {
        this.$store.commit('productFeed/SAVE_CONFIGURATION_CONNECTED_ONCE', false);
      } else if (this.googleAdsAccountConnectedOnce) {
        this.$store.commit('googleAds/SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE', false);
      } else if (this.phoneNumberVerified) {
        this.phoneNumberVerified = false;
      }
    },
    triggerLoadOfGoogleAdsAccount() {
      this.googleAdsIsLoading = true;
      this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST').then(() => this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT')
        .finally(() => {
          this.googleAdsIsLoading = false;
        }));
    },
  },
  computed: {
    ...mapGetters('app', [
      GettersTypesApp.GET_FEATURE_FLAG_ENHANCED_CONVERSIONS,
      GettersTypesApp.GET_BILLING_SUBSCRIPTION_ACTIVE,
    ]),
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
    googleAdsAccountConnectedOnce() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE'];
    },
    getGoogleAdsAccount(): AccountInformations|null {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    googleAdsAccountIsChosen() {
      return this.getGoogleAdsAccount && this.getGoogleAdsAccount.id.length > 0;
    },
    billingSettingsCompleted() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_IS_SERVING'];
    },
    toastIsVisible() {
      return this.googleAccountConnectedOnce
        || this.merchantCenterAccountConnectedOnce
        || this.productFeedIsConfiguredOnce
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
    accountHasAtLeastOneCampaign(): boolean {
      return this.$store.getters['campaigns/GET_ACCOUNT_HAS_AT_LEAST_ONE_CAMPAIGN'];
    },
    remarketingTagIsSet() {
      return this.$store.getters['campaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
    },
    enhancedConversionsHasNeverBeenEnabled(): boolean {
      return this.$store.getters['campaigns/GET_ENHANCED_CONVERSIONS_NEVER_ENABLED'];
    },
    stepsAreCompleted() {
      return {
        step1: this.psAccountsIsOnboarded
          && this.GET_BILLING_SUBSCRIPTION_ACTIVE
          && this.cloudSyncSharingConsentGiven,
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
        this.$store.dispatch('googleAds/WARMUP_STORE');
        this.$store.dispatch('productFeed/WARMUP_STORE');
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
        this.$store.dispatch('campaigns/GET_CAMPAIGNS_LIST').finally(() => {
          this.SSCIsLoading = false;
        });
        this.$store.dispatch('campaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
        this.$store.dispatch('campaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED');
      }
    },

  },
  CampaignTypes,
});
</script>
