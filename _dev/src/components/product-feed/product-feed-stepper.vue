<template>
  <stepper
    class="mt-2"
    :steps="steps"
    :active-step="activeStep"
  />
</template>

<script>
import Stepper from '../commons/stepper';
import {getDataFromLocalStorage} from '../../utils/LocalStorage';

export default {
  name: 'ProductFeedStepper',
  components: {
    Stepper,
  },
  props: {
    activeStep: {
      type: Number,
      required: false,
      default: (() => {
        const step = getDataFromLocalStorage('productFeed-stepNumber');

        if (step !== null) {
          return step;
        }
        return 1;
      }),
    },
  },
  computed: {
    steps() {
      return [
        {
          title: this.$i18n.t('productFeedSettings.steps.shippingSetup'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.deliveryTimesAndRates'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.attributeMapping'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.syncSchedule'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.summary'),
        },
      ];
    },
  },
};
</script>
