<template>
  <div>
    <!-- Module update messages -->
    <PsToast
      v-if="moduleUpdateSuccess"
      variant="success"
      :visible="moduleUpdateSuccess"
      toaster="b-toaster-top-right"
      body-class="border border-success"
    >
      <div>
        <h3 class="mb-1">
          {{ $t("monetization.successUpdatedTitle") }}
        </h3>
        <p>{{ $t("monetization.successUpdatedSubtitle") }}</p>
      </div>
    </PsToast>
    <PsToast
      v-if="moduleUpdateSuccess === false && modaleIsClosed"
      :visible="moduleUpdateSuccess === false && !moduleUpdateSuccess && modaleIsClosed"
      variant="warning"
      toaster="b-toaster-top-right"
      body-class="border border-warning"
    >
      <div>
        <h3 class="mb-1">
          {{ $t("monetization.failedUpdatedTitle") }}
        </h3>
        <p>{{ $t("monetization.failedUpdatedSubtitle") }}</p>
      </div>
    </PsToast>

    <MonetizationAlertWarningUpdateModule
      v-if="moduleNeedUpgrade && modaleIsClosed && moduleUpdateSuccess !== true"
      @updateSuccess="($event) => moduleUpdateSuccess = $event"
    />
    <MonetizationPopinUpdateModule
      v-if="moduleNeedUpgrade && moduleUpdateSuccess === null"
      @closeModale="modaleIsClosed = true"
      @updateSuccess="($event) => moduleUpdateSuccess = $event"
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
      :title="$t('monetization.alertSubscriptionCancelTitle')"
      :subtitle="$t('monetization.alertSubscriptionCancelSubtitle', [endOfSubscriptionDate])"
      @startSubscription="($event) => $emit('startSubscription', $event)"
    />
    <MonetizationAlertEndSubscription
      v-else-if="!moduleNeedUpgrade
        && subscription
        && !GET_BILLING_SUBSCRIPTION_ACTIVE
        && subscription.cancelled_at
        && page === 'configuration'"
      :subscription="subscription"
      :title="$t('monetization.alertSubscriptionExpiredTitle')"
      :subtitle="
        $t('monetization.alertSubscriptionExpiredSubtitle', [endOfSubscriptionDate])"
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
      moduleUpdateSuccess: null as boolean|null,
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
});
</script>
