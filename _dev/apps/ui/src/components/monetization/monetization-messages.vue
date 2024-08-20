<template>
  <div>
    <AlertModuleUpdate
      v-if="moduleNeedUpgrade && modaleIsClosed"
      module-name="psxmarketingwithgoogle"
      @updateSuccess="($event) => moduleUpdateSuccess = $event"
    >
      <template #title>
        <h3 class="h3">
          {{ $t('monetization.updateTitle') }}
        </h3>
      </template>
      <template #content>
        <p>
          {{ $t('monetization.bannerWarningText') }}
        </p>
      </template>
    </AlertModuleUpdate>

    <PopinUpdateModule
      v-if="moduleNeedUpgrade"
      module-name="psxmarketingwithgoogle"
      @closeModale="modaleIsClosed = true"
      @updateSuccess="($event) => moduleUpdateSuccess = $event"
    >
      <template #title>
        <h2>
          <span
            class="rounded-circle
            bg-ocean-blue-50 d-inline-flex align-items-center justify-content-center mr-2"
            style="width: 40px; height: 40px;"
          >
            <i class="material-icons ps_gs-fz-24">update</i>
          </span>
          {{ $t('monetization.updateTitle') }}
        </h2>
      </template>
      <template #content>
        <slot name="content-modale" />
      </template>
    </PopinUpdateModule>

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
import PopinUpdateModule from '@/components/commons/popin-update-module.vue';
import MonetizationBannerInformation from '@/components/monetization/monetization-banner-information.vue';
import AlertModuleUpdate from '@/components/commons/alert-update-module.vue';
import AppGettersTypes from '@/store/modules/app/getters-types';
import AccountsGettersTypes from '@/store/modules/accounts/getters-types';
import MonetizationAlertEndSubscription from './monetization-alert-end-subscription.vue';

export default defineComponent({
  name: 'MonetizationMessage',
  components: {
    MonetizationBannerInformation,
    MonetizationAlertEndSubscription,
    PopinUpdateModule,
    AlertModuleUpdate,
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
      moduleNeedUpgrade: false,
    };
  },
  computed: {
    ...mapGetters('app', [
      AppGettersTypes.GET_BILLING_SUBSCRIPTION_ACTIVE,
    ]),
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
    async checkModuleNeedUpgrade() {
      this.moduleNeedUpgrade = await this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`]('psxmarketingwithgoogle');
    },
  },
  created() {
    this.checkModuleNeedUpgrade();
  },
});
</script>
