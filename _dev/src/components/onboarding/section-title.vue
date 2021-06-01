<template>
  <h2
    class="ps_gs-section-title"
    :class="{ 'ps_gs-section-title--disabled' : !isEnabled }"
  >
    <span
      v-if="!this.isDone"
      class="d-inline-block ml-2 mr-3 ps_gs-section-title__step"
    >
      {{ stepNumber }}.
    </span>
    <i
      v-else
      class="material-icons ml-2 mr-3 mb-0 text-success"
    >
      check_circle
    </i>
    {{ stepTitle }}
  </h2>
</template>

<script>
export default {
  name: 'SectionTitle',
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    stepNumber: {
      type: Number,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
