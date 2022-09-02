<template>
  <div class="mb-4">
    <p class="h3 mb-3 font-weight-600">
      {{ $t('productFeedSettings.deliveryTimeAndRates.customRate.title') }}
    </p>
    <div class="container">
      <div class="row">
        <div class="col">
          <div
            class="p-3 border rounded"
          >
            <b-form-radio
              @change="rateSelected"
              data-test-id="radioButton"
              v-model="rateTypeChosen"
              name="customRateRadio"
              :value="RateType.SAME_FOR_ALL"
            >
              <div>
                <span class="font-weight-600 mb-2">
                  {{ $t('productFeedSettings.deliveryTimeAndRates.customRate.rateTitle') }}
                </span>
                <VueShowdown
                  class="text-muted ps_gs-fz-14 mb-0"
                  :markdown="$t('productFeedSettings.deliveryTimeAndRates.customRate.rateDesc')"
                />
              </div>
            </b-form-radio>
          </div>
        </div>
        <div class="col">
          <div
            class="p-3 border rounded"
          >
            <b-form-radio
              @change="rateSelected"
              v-model="rateTypeChosen"
              name="customRateRadio"
              :value="RateType.CUSTOM_RATE"
              :disabled="isMultipleCountries <= 1"
            >
              <div>
                <span class="font-weight-600 mb-2">
                  {{ $t('productFeedSettings.deliveryTimeAndRates.customRate.customTitle') }}
                </span>
                <VueShowdown
                  class="text-muted ps_gs-fz-14 mb-0"
                  :markdown="$t('productFeedSettings.deliveryTimeAndRates.customRate.customDesc')"
                />
              </div>
            </b-form-radio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {RateType} from '@/enums/product-feed/rate';

export default Vue.extend({
  data() {
    return {
      rateTypeChosen: '',
      RateType,
    };
  },
  props: {
    isMultipleCountries: {
      type: Number,
      required: true,
    },
  },
  computed: {
  },
  methods: {
    rateSelected(): void {
      this.$emit('rateTypeChosen', this.rateTypeChosen);
    },
  },
});
</script>
