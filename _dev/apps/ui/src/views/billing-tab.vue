<template>
  <div
    class="m-3"
  >
    <b-card
      no-body
    >
      <b-card-header>
        {{ $t('billing.planTitle') }}
      </b-card-header>

      <b-card-body
        class="pl-3 pr-3"
      >
        <div id="ps-billing-in-billing-tab" />
        <div id="ps-modal-in-billing-tab" />
      </b-card-body>
    </b-card>

    <b-card
      no-body
      class="mt-3"
    >
      <b-card-header>
        {{ $t('billing.invoicesTitle') }}
      </b-card-header>

      <b-card-body
        class="pl-3 pr-3"
      >
        <div id="ps-billing-invoice" />
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {billingUpdateCallback, initialize} from '@/lib/billing';

export default defineComponent({
  name: 'BillingTab',
  mounted() {
    if (!window.psBilling || !window.psBillingContext) {
      return;
    }
    initialize(
      window.psBilling,
      window.psBillingContext.context,
      '#ps-billing-in-billing-tab',
      '#ps-modal-in-billing-tab',
      billingUpdateCallback(window.psBilling, this.$store.state.app),
    );

    window.psBilling.initializeInvoiceList(
      window.psBillingContext.context,
      '#ps-billing-invoice',
    );
  },
});
</script>
