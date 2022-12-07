<template>
  <div class="mb-4">
    <p class="h3 mb-3 font-weight-600">
      {{ $t('productFeedSettings.deliveryTimeAndRates.customRate.title') }}
    </p>
    <div class="container-fluid">
      <div class="row">
        <div class="col col-12 col-md border rounded p-3 mr-1">
          <div>
            <b-form-radio
              data-test-id="radioButton"
              v-model="rateSelected"
              @change="rateUpdated($event)"
              name="customRateRadio"
              :value="RateType.RATE_ALL_COUNTRIES"
            >
              <div>
                <span class="font-weight-600 mb-2">
                  {{ $t('productFeedSettings.deliveryTimeAndRates.customRate.rateTitle') }}
                </span>
                <VueShowdown
                  :extensions="['no-p-tag']"
                  class="text-muted ps_gs-fz-14 mb-0"
                  :markdown="$t('productFeedSettings.deliveryTimeAndRates.customRate.rateDesc')"
                />
              </div>
            </b-form-radio>
          </div>
        </div>
        <div class="col col-12 col-md border rounded p-3 mt-1 mt-md-0 ml-md-1">
          <div>
            <b-form-radio
              v-model="rateSelected"
              @change="rateUpdated($event)"
              name="customRateRadio"
              :value="RateType.RATE_PER_COUNTRY"
              :disabled="!isMultipleCountries"
            >
              <div>
                <span class="font-weight-600 mb-2">
                  {{ $t('productFeedSettings.deliveryTimeAndRates.customRate.customTitle') }}
                </span>
                <VueShowdown
                  :extensions="['no-p-tag']"
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
      type: Boolean,
      required: true,
    },
    rateTypeChosen: {
      type: String as PropType<RateType|null>,
      required: false,
      default: null,
    },
  },
  computed: {
    rateSelected: {
      get() {
        return this.rateTypeChosen;
      },
      set() {
        // Do nothing, react only on user interaction
      },
    },
  },
  methods: {
    rateUpdated(value): void {
      this.$emit('rateUpdated', value);
    },
  },
});
</script>
