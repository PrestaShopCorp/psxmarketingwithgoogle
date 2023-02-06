<template>
  <h2
    class="ps_gs-section-title"
    :class="{ 'ps_gs-section-title--disabled' : !isEnabled }"
  >
    <div
      v-if="!this.isDone"
      class="circle mr-3 ml-2 d-inline-block"
      :class="!isEnabled ? 'bg-circle-disabled' : 'bg-circle-active'"
    >
      {{ stepNumber }}
    </div>
    <i
      v-else
      class="material-icons ml-2 mr-3 mb-0 text-success step-done-icons"
    >
      check_circle
    </i>
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
    badge: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
