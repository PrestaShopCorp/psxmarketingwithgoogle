<template>
  <b-card class="p-2">
    <b-card-body class="d-lg-flex">
      <p class="mb-lg-0">
        {{ $t('onboarding.sectionTitle.billing.cardText') }}
      </p>
      <b-button
        variant="primary"
        class="ml-lg-3 text-nowrap"
        :disabled="disabled"
        @click="$emit('clickToSubscibe')"
      >
        {{ $t('cta.startFreeTrial') }}
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'BillingCard',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
