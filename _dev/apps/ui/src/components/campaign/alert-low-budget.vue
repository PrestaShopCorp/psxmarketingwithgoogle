<template>
  <span
    class="ps_gs-alert-mini-warning"
    v-b-tooltip:psxMktgWithGoogleApp
    :title="$t('campaigns.tooltip.lowBudget')"
  >
    {{ formatedPrice }}
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'AlertLowBudget',
  props: {
    formatedPrice: {
      required: true,
      type: String,
    },
  },
});
</script>
