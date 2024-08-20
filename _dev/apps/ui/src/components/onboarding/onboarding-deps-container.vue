<template>
  <div class="w-100">
    <monetization-messages
      class="container"
      page="configuration"
      :subscription="subscription"
      @startSubscription="startSubscription"
    >
      <template #content-modale>
        {{ $t('monetization.popinUpdateConfigurationText') }}
      </template>
    </monetization-messages>

    <two-panel-cols
      :title="$t('onboarding.sectionTitle.psAccount')"
    >
      <prestashop-accounts
        class="ps_gs-ps-account-card"
      />
    </two-panel-cols>
    <two-panel-cols
      v-if="billingContext && !moduleNeedUpgrade"
      :title="$t('onboarding.sectionTitle.psbilling.title')"
      :description="$t('onboarding.sectionTitle.psbilling.subTitle')"
    >
      <b-alert
        v-if="!billingRunning && merchantCenterAccountIsChosen"
        show
        variant="warning"
        class="border border-warning mt-2 mb-0"
      >
        {{ $t('onboarding.sectionTitle.psbilling.alertNoSynchro') }}
      </b-alert>
      <div
        class="mb-1"
        v-show="!billingRunning"
        id="ps-billing-in-catalog-tab"
      />
      <div id="ps-modal-in-catalog-tab" />
      <card-billing-connected
        v-if="billingRunning && subscription"
        :subscription="subscription"
      />
    </two-panel-cols>
    <two-panel-cols
      :title="$t('onboarding.sectionTitle.pscloudsync.title')"
      :description="$t('onboarding.sectionTitle.pscloudsync.subTitle')"
      v-show="billingRunning"
    >
      <div
        id="prestashop-cloudsync"
        class="p-0"
      />
    </two-panel-cols>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {ISubscription} from '@prestashopcorp/billing-cdc/dist/@types/Subscription';
import {IContextAuthentication, IContextBase} from '@prestashopcorp/billing-cdc/dist/@types/context/ContextRoot';
import CardBillingConnected from './card-billing-connected.vue';
import {billingUpdateCallback, initialize} from '@/lib/billing';
import SegmentGenericParams from '../../utils/SegmentGenericParams';
import TwoPanelCols from './two-panel-cols.vue';
import MonetizationMessages from '@/components/monetization/monetization-messages.vue';
import AppGettersTypes from '@/store/modules/app/getters-types';
import AccountGettersTypes from '@/store/modules/accounts/getters-types';

export default defineComponent({
  name: 'OnboardingDepsContainer',
  components: {
    CardBillingConnected,
    TwoPanelCols,
    MonetizationMessages,
  },
  props: {
    subscription: {
      type: Object as PropType<ISubscription>,
      default: null,
    },
    psAccountsOnboarded: {
      type: Boolean,
      required: true,
    },
    billingRunning: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      openBillingModal: null as Function|null,
      moduleNeedUpgrade: false,
    };
  },
  computed: {
    billingContext(): IContextBase<IContextAuthentication>|undefined {
      return window.psBillingContext;
    },
    merchantCenterAccountIsChosen() {
      return this.$store.getters[`accounts/${AccountGettersTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED}`];
    },
  },
  methods: {
    initCloudSyncConsent() {
      // If data related to CloudSync consent screen is available...
      if (!window.cloudSyncSharingConsent || !this.psAccountsOnboarded) {
        return;
      }

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
    async checkModuleNeedUpgrade() {
      this.moduleNeedUpgrade = await this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`]('psxmarketingwithgoogle');
    },
  },
  mounted() {
    this.initAccountsComponent();
    this.initBillingComponent();
    this.initCloudSyncConsent();
    window.addEventListener('load', () => {
      this.initCloudSyncConsent();
    });
    this.checkModuleNeedUpgrade();
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
