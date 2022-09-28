<template>
  <stepper
    class="mt-2"
    :steps="steps"
    :active-step="activeStep"
    @changeStep="stepToChange($event)"
  />
</template>

<script>
import ProductFeedSettingsSteps from '@/enums/product-feed/product-feed-settings-steps';
import Stepper from '../commons/stepper';

export default {
  name: 'ProductFeedStepper',
  components: {
    Stepper,
  },
  props: {
    activeStep: {
      type: Number,
      required: false,
      default: 1,
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
  methods: {
    stepToChange(value) {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', value);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsSteps[value] || null,
        },
      });
    },
  },

};
</script>
