<template>
  <b-alert
    class="border border-info d-md-flex align-items-md-center justify-content-md-between container"
    variant="info"
    show
  >
    <div>
      <h3 class="h3">
        {{ title }}
      </h3>
      <p>
        {{ subtitle }}
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
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'MonetizationAlertSubscriptionCancel',
  props: {
    title: {
      type: String,
      default: null,
    },
    subtitle: {
      type: String,
      default: null,
    },
  },
});
</script>
