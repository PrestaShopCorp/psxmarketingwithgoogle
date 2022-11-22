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
              data-test-id="radioButton"
              v-model="rateSelected"
              name="customRateRadio"
              :value="RateType.RATE_ALL_COUNTRIES"
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
              v-model="rateSelected"
              name="customRateRadio"
              :value="RateType.RATE_PER_COUNTRY"
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
import Vue, {PropType} from 'vue';
import {RateType} from '@/enums/product-feed/rate';

export default Vue.extend({
  data() {
    return {
      RateType,
    };
  },
  props: {
    isMultipleCountries: {
      type: Number,
      required: true,
    },
    rateTypeChosen: {
      type: String as PropType<RateType>,
      required: false,
    },
  },
  computed: {
    rateSelected: {
      get() {
        return this.$props.rateTypeChosen;
      },
      set(value) {
        this.$emit('rateUpdated', value);
      },
    },
  },
});
</script>
