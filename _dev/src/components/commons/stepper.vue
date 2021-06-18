<template>
  <ol class="ps_gs-stepper position-relative justify-content-center p-0 mb-3">
    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="ps_gs-stepper-step col px-0"
      :class="{
        'active': isActive(index),
        'complete': isComplete(index)
      }"
      :aria-current="isActive(index) ? 'step' : null"
    >
      <component
        :is="isComplete(index) ? 'a' : 'div'"
        :href="isComplete(index) ? '#' : null"
        @click.prevent="isComplete(index) ? handleStepClick(index) : null"
        class="ps_gs-stepper-step__link"
      >
        <div
          class="ps_gs-stepper-step__step d-flex align-items-center justify-content-center"
          @click="goStep(index+1)"
        >
          <b-icon-check
            v-if="isComplete(index)"
            variant="white"
            font-scale="2"
          />
          <span
            v-else
            :data-stepperLength="steps.length"
          >
            {{ index + 1 }}
          </span>
          <ProgressRing
            v-if="isActive(index)"
            :radius="22"
            :progress="(index + 1) / (steps.length) * 100"
            :stroke="2"
          />
        </div>
        <div
          class="ps_gs-stepper-step__title px-2"
          :data-nextStep="nextStepMsg(index)"
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

import ProgressRing from '../commons/progress-ring';

export default {
  name: 'Stepper',
  components: {
    BIconCheck,
    ProgressRing,
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
  methods: {
    isComplete(index) {
      return index < this.mutableActiveStep - 1;
    },
    isActive(index) {
      return index + 1 === this.mutableActiveStep;
    },
    handleStepClick(index) {
      this.mutableActiveStep = index + 1;
    },
    nextStepMsg(index) {
      if (index < (this.steps.length - 1)) {
        return this.$i18n.t('stepper.nextStep', [this.steps[index + 1].title]);
      }
      return this.$i18n.t('stepper.lastStep');
    },

    goStep(index) {
      if (this.$store.state.productFeed.stepper >= index) {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', index);
      }
    },
  },
  computed: {
    mutableActiveStep: {
      get() {
        return this.activeStep;
      },
    },
  },
};
</script>
