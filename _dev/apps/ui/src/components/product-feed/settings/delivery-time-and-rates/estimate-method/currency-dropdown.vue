<template>
  <b-dropdown
    :text="selectedCurrency"
    variant="outline-secondary"
    size="sm"
  >
    <b-dropdown-item
      v-for="(currency, i) in currencies"
      :key="i"
      @click="$emit('update:selectedCurrency', currency)"
    >
      {{ currency }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  name: 'CurrencyDropdown',
  props: {
    currencies: {
      type: Array as PropType<string[]>,
      required: true,
    },
    selectedCurrency: {
      type: String,
      required: true,
    },
  },
});
</script>