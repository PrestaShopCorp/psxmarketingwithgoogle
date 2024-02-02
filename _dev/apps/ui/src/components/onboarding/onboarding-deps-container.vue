<template>
  <div class="row mb-4 ps_gs-onboardingpage">
    <div class="col-12 col-md-5">
      <div
        class="is-sticky pb-3"
      >
        <section-title
          :step-number="1"
          :step-title="$t('onboarding.sectionTitle.psAccount')"
          :is-enabled="true"
          :is-done="stepsAreCompleted"
        />
      </div>
    </div>
    <div class="col-12 col-md-7">
      <prestashop-accounts
        class="ps_gs-ps-account-card"
      />

      <div
        v-show="!billingRunning"
        id="ps-billing-in-catalog-tab"
      />
      <div id="ps-modal-in-catalog-tab" />
      <card-billing-connected
        v-if="billingRunning && billingSubscription"
        :subscription="billingSubscription"
      />

      <div
        id="prestashop-cloudsync"
        class="p-0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ISubscription} from '@prestashopcorp/billing-cdc/dist/@types/Subscription';
import {IContextAuthentication, IContextBase} from '@prestashopcorp/billing-cdc/dist/@types/context/ContextRoot';
import CardBillingConnected from './card-billing-connected.vue';
import SectionTitle from '@/components/onboarding/section-title';
import {State as AppState} from '@/store/modules/app/state';
import {billingUpdateCallback, initialize} from '@/lib/billing';
import SegmentGenericParams from '../../utils/SegmentGenericParams';

export default defineComponent({
  name: 'OnboardingDepsContainer',
  components: {
    CardBillingConnected,
    SectionTitle,
  },
  props: {
    psAccountsOnboarded: {
      type: Boolean,
      required: true,
    },
    billingRunning: {
      type: Boolean,
      required: true,
    },
    stepsAreCompleted: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      openBillingModal: null as Function|null,
    };
  },
  computed: {
    billingContext(): IContextBase<IContextAuthentication>|undefined {
      return window.psBillingContext;
    },
    billingSubscription(): ISubscription|undefined {
      return (this.$store.state.app as AppState).billing.subscription;
    },
  },
  methods: {
    initCloudSyncConsent() {
      // If data related to CloudSync consent screen is available...
      if (!window.cloudSyncSharingConsent) {
        return;
      }

      console.log('CloudSync Sharing Consent feature detected. Loading...');
      const msc = window.cloudSyncSharingConsent;
      msc.init();
      msc.on('OnboardingCompleted', (isCompleted) => {
        if (isCompleted) {
          this.$segment.track('[GGL] Consent to share data of CloudSync', {
            module: 'psxmarketingwithgoogle',
            params: SegmentGenericParams,
          });
          this.$emit('onCloudsyncConsentUpdated', isCompleted);
        }
      });
      msc.isOnboardingCompleted((isCompleted) => {
        // Identify only when we get a valid boolean value
        if (!!isCompleted === isCompleted) {
          this.$segment.identify(this.$store.state.accounts.shopIdPsAccounts, {
            ggl_user_has_given_consent_to_use_cloudsync: isCompleted,
          });
          this.$emit('onCloudsyncConsentUpdated', isCompleted);
        }
      });
    },
    initAccountsComponent() {
      if (!window.psaccountsVue) {
        return;
      }
      window.psaccountsVue.init();
    },
    initBillingComponent(): void {
      if (!window.psBilling || !this.billingContext) {
        return;
      }
      const {openCheckout} = initialize(
        window.psBilling,
        this.billingContext.context,
        '#ps-billing-in-catalog-tab',
        '#ps-modal-in-catalog-tab',
        billingUpdateCallback(window.psBilling, this.$store.state.app),
      );
      this.openBillingModal = openCheckout;
    },
    startSubscription($event: string): void {
      if (this.openBillingModal) {
        this.openBillingModal($event);
      }
    },
  },
  mounted() {
    this.initAccountsComponent();
    this.initBillingComponent();
    this.initCloudSyncConsent();
  },
  watch: {
    psAccountsOnboarded: {
      handler(newValue: boolean) {
        if (newValue === true) {
          this.initBillingComponent();
        }
      },
    },
    billingRunning: {
      handler(newValue: boolean) {
        if (newValue === true) {
          this.initCloudSyncConsent();
        }
      },
    },
  },
});
</script>
