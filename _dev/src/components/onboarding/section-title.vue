<template>
  <h2
    class="ps_gs-section-title"
    :class="{ 'ps_gs-section-title--disabled' : !isEnabled }"
  >
    <span
      v-if="!this.isDone"
      class="d-inline-block mx-3"
    >
      {{ stepNumber }}.
    </span>
    <b-iconstack
      v-else
      font-scale="1.5"
      class="ml-2 mr-3 fixed-size color-green"
      width="20"
      height="20"
    >
      <b-icon-circle-fill
        stacked
      />
      <b-icon-check
        stacked
        variant="white"
      />
    </b-iconstack>
    {{ stepTitle }}
  </h2>
</template>

<script>
import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
} from 'bootstrap-vue';

export default {
  name: 'SectionTitle',
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
  },
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

<style lang="">
</style>
