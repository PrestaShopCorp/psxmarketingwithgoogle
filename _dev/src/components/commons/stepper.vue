<template>
  <ol class="ps_gs-stepper position-relative justify-content-between p-0 mb-3">
    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="ps_gs-stepper-step col position-relative"
      :class="{
        'active': index + 1 == activeStep,
        'complete': isComplete(index)
      }"
    >
      <div class="ps_gs-stepper-step__step d-flex align-items-center justify-content-center">
        <b-icon-check
          v-if="isComplete(index)"
          variant="white"
          font-scale="2"
        />
        <span
          v-else
        >
          {{ index + 1 }}
        </span>
      </div>
      <div
        :class="{'text-muted': !step.active && !isComplete(index)}"
        class="ps_gs-stepper-step__title ps_gs-fz-12 text-center"
      >
        {{ step.title }}
      </div>
    </li>
  </ol>
</template>

<script>
import {
  BIconCheck,
} from 'bootstrap-vue';

export default {
  name: 'Stepper',
  components: {BIconCheck},
  data() {
    return {
    };
  },
  methods: {
    isComplete(index) {
      return index < this.activeStep - 1;
    },
  },
  props: {
    steps: {
      type: Array,
      required: true,
    },
    activeStep: {
      type: Number,
      default: 1,
    },
  },
};
</script>
