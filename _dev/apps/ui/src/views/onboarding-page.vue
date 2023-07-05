<template>
  <div class="pt-2 container">
    <div class="row row-cols-sm-1 row-cols-md-2 mb-4 ps_gs-onboardingpage">
      <div class="col">
        <div
          class="is-sticky pb-3"
        >
          <section-title
            :step-number="1"
            :step-title="$t('onboarding.sectionTitle.psAccount')"
            :is-enabled="true"
            :is-done="stepsAreCompleted.step1"
          />
        </div>
      </div>
      <div class="col">
        <prestashop-accounts
          class="ps_gs-ps-account-card"
        />
        <div
          id="prestashop-cloudsync"
        />
      </div>

      <div class="col">
        <div
          class="is-sticky pb-3"
        >
          <section-title
            :step-number="2"
            :step-title="$t('onboarding.sectionTitle.freeListing.title')"
            :is-enabled="stepsAreCompleted.step1"
            :is-done="stepsAreCompleted.step2"
          />
          <div class="stepper-onboarding-subtitle">
            <p class="text-justify ps_gs-fz-14">
              {{ $t('onboarding.sectionTitle.freeListing.subtitle') }}
            </p>
            <p class="text-muted ps_gs-fz-13">
              {{ $t('onboarding.sectionTitle.freeListing.lastTitle') }}
            </p>
          </div>
        </div>
      </div>
      <div class="col mb-3">
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
      </div>

      <div class="col">
        <div
          class="is-sticky pb-3"
        >
          <section-title
            :step-number="3"
            :step-title="$t('onboarding.sectionTitle.smartShoppingCampaign.title')"
            :is-enabled="stepsAreCompleted.step2"
            :is-done="stepsAreCompleted.step3"
          />
          <div class="stepper-onboarding-subtitle">
            <VueShowdown
              class="text-justify ps_gs-fz-14"
              :markdown="$t('onboarding.sectionTitle.smartShoppingCampaign.subtitle')"
            />
          </div>
        </div>
      </div>
      <div class="col">
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
        <PromoCard />
      </div>
    </div>

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
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTrackingOnboardingPage"
      modal-id="SSCPopinActivateTrackingOnboardingPage"
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

<script>
import SectionTitle from '../components/onboarding/section-title';
import GoogleAccountCard from '../components/google-account/google-account-card';
import GoogleAdsAccountCard from '../components/google-ads-account/google-ads-account-card';
import MerchantCenterAccountCard from '../components/merchant-center-account/merchant-center-account-card.vue';
import ProductFeedCard from '../components/product-feed/product-feed-card.vue';
import GoogleAccountPopinDisconnect from '../components/google-account/google-account-popin-disconnect.vue';
import MerchantCenterAccountPopinDisconnect from '../components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import GoogleAdsAccountPopinDisconnect from '../components/google-ads-account/google-ads-account-popin-disconnect.vue';
import GoogleAdsPopinNew from '../components/google-ads-account/google-ads-account-popin-new.vue';
import CampaignCard from '../components/campaigns/campaign-card.vue';
import CampaignTracking from '../components/campaigns/campaign-tracking.vue';
import PromoCard from '../components/promo/promo-card.vue';
import SSCPopinActivateTracking from '../components/campaigns/ssc-popin-activate-tracking.vue';
import PsToast from '../components/commons/ps-toast';
import PopinModuleConfigured from '../components/commons/popin-configured.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  name: 'OnboardingPage',
  components: {
    SectionTitle,
    GoogleAccountCard,
    GoogleAdsAccountCard,
    MerchantCenterAccountCard,
    ProductFeedCard,
    CampaignCard,
    CampaignTracking,
    PromoCard,
    GoogleAccountPopinDisconnect,
    MerchantCenterAccountPopinDisconnect,
    GoogleAdsAccountPopinDisconnect,
    GoogleAdsPopinNew,
    PsToast,
    SSCPopinActivateTracking,
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
      } else if (this.freeListingIsActivatedOnce) {
        this.$store.commit('freeListing/SAVE_ACTIVATED_ONCE', false);
      } else if (this.googleAdsAccountConnectedOnce) {
        this.$store.commit('googleAds/SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE', false);
      } else if (this.phoneNumberVerified) {
        this.phoneNumberVerified = false;
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
    initCloudSyncConsent() {
      // If data related to CloudSync consent screen is available...
      if (!window.cloudSyncSharingConsent || !this.psAccountsIsOnboarded) {
        return;
      }

      // ... and the component is not already loaded
      if (this.cloudSyncSharingConsentScreenStarted) {
        return;
      }
      this.cloudSyncSharingConsentScreenStarted = true;

      console.log('CloudSync Sharing Consent feature detected. Loading...');
      const msc = window.cloudSyncSharingConsent;
      msc.init();
      msc.on('OnboardingCompleted', (isCompleted) => {
        if (isCompleted) {
          this.$segment.track('[GGL] Consent to share data of CloudSync', {
            module: 'psxmarketingwithgoogle',
            params: SegmentGenericParams,
          });
          this.cloudSyncSharingConsentGiven = isCompleted;
        }
      });
      msc.isOnboardingCompleted((isCompleted) => {
        // Identify only when we get a valid boolean value
        if (!!isCompleted === isCompleted) {
          this.$segment.identify(this.$store.state.accounts.shopIdPsAccounts, {
            ggl_user_has_given_consent_to_use_cloudsync: isCompleted,
          });
          this.cloudSyncSharingConsentGiven = isCompleted;
        }
      });
    },
    initAccountsComponent() {
      if (!window.psaccountsVue) {
        return;
      }
      window.psaccountsVue.init();
    },
  },
  computed: {
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
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_ALL_CAMPAIGNS']?.length;
    },
    remarketingTagIsSet() {
      return this.$store.getters['campaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
    },
    stepsAreCompleted() {
      return {
        step1: this.psAccountsIsOnboarded
          && (this.cloudSyncSharingConsentGiven
          || this.googleAccountIsOnboarded
          // Make CSC optional when the running PHP is not up to date
          || !window.contextPsEventbus
          ),
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
    this.initAccountsComponent();
    this.initCloudSyncConsent();

    window.addEventListener('load', () => {
      this.initAccountsComponent();
      this.initCloudSyncConsent();
    });

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
        this.$store.dispatch('campaigns/GET_CAMPAIGNS_LIST', {isNewRequest: true}).finally(() => {
          this.SSCIsLoading = false;
        });
        this.$store.dispatch('campaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
        this.$store.dispatch('campaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED');
      }
    },

  },
  CampaignTypes,
};
</script>
