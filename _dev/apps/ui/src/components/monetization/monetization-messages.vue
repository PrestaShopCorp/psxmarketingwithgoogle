<template>
  <div>
    <!-- Module update messages -->
    <PsToast
      v-if="moduleIsUpdated"
      variant="success"
      :visible="moduleIsUpdated"
      toaster="b-toaster-top-right"
      body-class="border border-success"
    >
      <p>{{ $t("toast.moduleUpdated") }}</p>
    </PsToast>
    <MonetizationAlertWarningUpdateModule
      v-if="moduleNeedUpgrade && modaleIsClosed && !moduleIsUpdated"
      @moduleUpdated="clickModuleUpdated"
    />
    <MonetizationPopinUpdateModule
      v-if="moduleNeedUpgrade && !moduleIsUpdated"
      @clickUpdateModule="moduleIsUpdated = true"
      @closeModale="modaleIsClosed = true"
    >
      <template #content>
        <slot name="content-modale" />
      </template>
    </MonetizationPopinUpdateModule>

    <!-- Messages for module monetization -->
    <MonetizationAlertEndSubscription
      v-if="!moduleNeedUpgrade
        && subscription
        && GET_BILLING_SUBSCRIPTION_ACTIVE
        && subscription.cancelled_at
        && page === 'configuration'"
      :subscription="subscription"
      :title="$t('banner.monetization.alertSubscriptionCancelTitle')"
      :subtitle="$t('banner.monetization.alertSubscriptionCancelSubtitle', [endOfSubscriptionDate])"
      @startSubscription="($event) => $emit('startSubscription', $event)"
    />
    <MonetizationAlertEndSubscription
      v-else-if="!moduleNeedUpgrade
        && subscription
        && !GET_BILLING_SUBSCRIPTION_ACTIVE
        && subscription.cancelled_at
        && page === 'configuration'"
      :subscription="subscription"
      :title="$t('banner.monetization.alertSubscriptionExpiredTitle')"
      :subtitle="
        $t('banner.monetization.alertSubscriptionExpiredSubtitle', [endOfSubscriptionDate])"
      @startSubscription="($event) => $emit('startSubscription', $event)"
    />
    <MonetizationBannerInformation
      v-if="!moduleNeedUpgrade
        && !googleAccountIsOnboarded
        && !GET_BILLING_SUBSCRIPTION_ACTIVE
        && page === 'configuration'"
      class="mb-3"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {mapGetters} from 'vuex';
import {ISubscription} from '@prestashopcorp/billing-cdc';
import MonetizationPopinUpdateModule from '@/components/monetization/monetization-popin-update-module.vue';
import MonetizationAlertWarningUpdateModule from '@/components/monetization/monetization-alert-warning-update-module.vue';
import MonetizationBannerInformation from '@/components/monetization/monetization-banner-information.vue';
import PsToast from '@/components/commons/ps-toast.vue';
import AppGettersTypes from '@/store/modules/app/getters-types';
import AccountsGettersTypes from '@/store/modules/accounts/getters-types';
import MonetizationAlertEndSubscription from './monetization-alert-end-subscription.vue';

export default defineComponent({
  name: 'MonetizationMessage',
  components: {
    MonetizationBannerInformation,
    MonetizationPopinUpdateModule,
    MonetizationAlertWarningUpdateModule,
    MonetizationAlertEndSubscription,
    PsToast,
  },
  props: {
    subscription: {
      type: Object as PropType<ISubscription>,
      default: null,
    },
    page: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      moduleIsUpdated: false,
      modaleIsClosed: false,
    };
  },
  computed: {
    ...mapGetters('app', [
      AppGettersTypes.GET_BILLING_SUBSCRIPTION_ACTIVE,
    ]),
    moduleNeedUpgrade() {
      return this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`](this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded);
    },
    googleAccountIsOnboarded() {
      return this.$store.getters[`accounts/${AccountsGettersTypes.GET_GOOGLE_ACCOUNT_IS_ONBOARDED}`];
    },
    endOfSubscriptionDate(): string {
      return new Date(this.subscription.cancelled_at * 1000).toLocaleDateString(
        this.$i18n.locale,
        {dateStyle: 'long'},
      );
    },
  },
  methods: {
    clickModuleUpdated() {
      this.moduleIsUpdated = true;
    },
  },
});
</script>
