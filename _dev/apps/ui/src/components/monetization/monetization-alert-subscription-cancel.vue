<template>
  <b-alert
    class="border border-info d-md-flex align-items-md-center justify-content-md-between container"
    variant="info"
    show
  >
    <div>
      <h3 class="h3">
        {{ $t('banner.monetization.alertSubscriptionCancelTitle') }}
      </h3>
      <p>
        {{ $t('banner.monetization.alertSubscriptionCancelSubtitle', [endOfSubscriptionDate]) }}
      </p>
    </div>
    <b-button
      class="mt-3 mt-md-0 btn btn-info px-3 py-2 ml-3 d-flex flex-shrink-0"
      variant="info"
      @click="$emit('startSubscription', 'subscription_reactivation')"
    >
      {{ $t('cta.subscribe') }}
    </b-button>
  </b-alert>
</template>

<script lang="ts">
import {ISubscription} from '@prestashopcorp/billing-cdc';
import {defineComponent, PropType} from 'vue';

export default defineComponent({
  name: 'MonetizationAlertSubscriptionCancel',
  props: {
    subscription: {
      type: Object as PropType<ISubscription>,
      default: null,
    },
  },
  computed: {
    endOfSubscriptionDate(): string {
      return new Date(this.subscription.cancelled_at * 1000).toLocaleDateString(
        this.$i18n.locale,
        {dateStyle: 'long'},
      );
    },
  },
});
</script>
