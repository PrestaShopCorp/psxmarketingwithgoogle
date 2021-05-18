<template>
  <ol class="ps_gs-stepper position-relative justify-content-center p-0 mb-3">
    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="ps_gs-stepper-step col position-relative px-0"
      :class="{
        'active': index + 1 == mutableActiveStep,
        'complete': isComplete(index)
      }"
      :aria-current="index + 1 == mutableActiveStep ? 'step' : null"
    >
      <component
        :is="isComplete(index) ? 'a' : 'div'"
        :href="isComplete(index) ? '#' : null"
        @click.prevent="isComplete(index) ? handleStepClick(index) : null"
        class="ps_gs-stepper-step__link"
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
          class="ps_gs-stepper-step__title ps_gs-fz-12 text-center px-2"
        >
          {{ step.title }}
        </div>
      </component>
    </li>
  </ol>
</template>

<script>
import {
  BIconCheck,
} from 'bootstrap-vue';
export default {
  name: 'Stepper',
  components: { BIconCheck },
  data() {
    return {
      mutableActiveStep: this.activeStep,
    };
  },
  methods: {
    isComplete(index) {
      return index < this.mutableActiveStep - 1;
    },
    handleStepClick(index) {
      this.mutableActiveStep = index + 1;
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
