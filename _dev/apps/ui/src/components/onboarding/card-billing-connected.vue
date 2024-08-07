<template>
  <b-card no-body>
    <b-card-header class="d-flex mb-2">
      <span class="step-is-done rounded-circle bg-success d-flex align-items-center mr-2">
        <i class="material-icons-round text-light ps_gs-fz-16 ml-auto mr-auto">check</i>
      </span>
      {{ $t('billingFacade.title') }}
    </b-card-header>
    <b-card-body class="d-flex align-items-center mb-3">
      <i class="material-icons-round ps_gs-fz-48 mr-3">credit_card</i>
      {{ billingStatusText }}
      <div class="d-md-flex ml-auto text-center">
        <b-button
          class="mx-1 ml-md-0 mr-md-1"
          variant="outline-primary"
          @click="goToBilling"
        >
          {{ $t('billingFacade.managePayment') }}
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';
import {LocaleMessage} from 'vue-i18n';
import {ISubscription} from '@prestashopcorp/billing-cdc/dist/@types/Subscription';

export default defineComponent({
  name: 'CardBillingConnected',
  props: {
    subscription: {
      type: Object as PropType<ISubscription>,
      required: true,
    },
  },
  computed: {
    nextBillingDate(): string {
      return new Date(this.subscription.next_billing_at * 1000).toLocaleDateString(
        window.i18nSettings.languageLocale.substring(0, 2),
        {dateStyle: 'long'},
      );
    },
    endOfSubscriptionDate(): string {
      return new Date(this.subscription.cancelled_at * 1000).toLocaleDateString(
        window.i18nSettings.languageLocale.substring(0, 2),
        {dateStyle: 'long'},
      );
    },
    billingStatusText(): LocaleMessage {
      if (this.subscription.cancelled_at) {
        return this.$t('billingFacade.willEnd', {
          date: this.endOfSubscriptionDate,
        });
      }
      return this.$t('billingFacade.nextPayment', {
        date: this.nextBillingDate,
      });
    },
  },
  methods: {
    goToBilling() {
      this.$router.push({
        name: 'Billing',
      });
    },
  },
});
</script>
