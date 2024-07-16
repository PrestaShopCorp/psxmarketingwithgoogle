<template>
  <h2
    class="ps_gs-section-title"
    :class="{ 'ps_gs-section-title--disabled' : !isEnabled }"
  >
    {{ stepTitle }}

    <b-badge
      v-if="badge"
      class="mx-3"
      variant="success"
    >
      {{ $t('badge.new') }}
    </b-badge>
  </h2>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'SectionTitle',
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
