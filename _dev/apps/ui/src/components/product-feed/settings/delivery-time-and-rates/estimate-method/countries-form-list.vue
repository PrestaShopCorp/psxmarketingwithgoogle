<template>
  <!-- CASE FOR RATE_FOR_ALL_COUNTRIES -->
  <div class="estimateMultiCountries">
    <card-collapse
      id="for_all_countries"
      class="mb-1"
      v-if="rateChosen === RateType.RATE_ALL_COUNTRIES"
      visible
    >
      <div
        slot="title"
        class="p-1"
      >
        <span class="mr-2">
          {{ countriesNames.join(', ') }}
        </span>
        <span
          v-if="validateCarrier(carriers[0]) === false"
          class="text-danger spans-gs_fz-14 d-inline-block ml-2"
        >
          {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.error') }}
        </span>
      </div>
      <div
        slot="content"
        class="p-3"
      >
        <custom-carrier-form
          :estimate-carrier="carriers[0]"
          :display-validation-errors="displayValidationErrors"
          @carrierUpdated="carrierUpdated($event, 0)"
        />
      </div>
    </card-collapse>

    <!-- CASE FOR RATE_PER_COUNTRY -->
    <card-collapse
      id="card_per_country"
      class="mb-1"
      v-else-if="rateChosen === RateType.RATE_PER_COUNTRY"
      v-for="(carrier, index) in carriers"
      :key="index"
      :visible="(index === 0)"
    >
      <div
        slot="title"
        class="p-1"
      >
        <span>{{ $options.filters.changeCountriesCodesToNames(carrier.countries)[0] }}</span>
        <span
          v-if="validateCarrier(carrier) === false"
          class="text-danger spans-gs_fz-14 d-inline-block ml-2"
        >
          {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.error') }}
        </span>
      </div>
      <div
        slot="content"
        class="p-3"
      >
        <custom-carrier-form
          :estimate-carrier="carrier"
          :display-validation-errors="displayValidationErrors"
          @carrierUpdated="carrierUpdated($event, index)"
        />
      </div>
    </card-collapse>

    <!-- Errors -->
    <p
      v-if="!rateChosen && displayValidationErrors"
      class="text-danger text-small ps_gs-fz-12 d-md-flex justify-content-end"
    >
      <!-- eslint-disable-next-line max-len -->
      {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.validationErrors.missingRateOption') }}
    </p>
  </div>
</template>
<script lang="ts">
import Vue, {PropType} from 'vue';
import CustomCarrierForm from './custom-carrier-form.vue';
import {RateType} from '@/enums/product-feed/rate';
import {CustomCarrier, validateCarrier} from '@/providers/shipping-rate-provider';
import CardCollapse from '@/components/commons/card-collapse.vue';

export default Vue.extend({
  name: 'CountriesFormList',
  components: {
    CardCollapse,
    CustomCarrierForm,
  },
  props: {
    rateChosen: {
      type: [String, Boolean] as PropType<RateType|false|null>,
      required: false,
      default: null,
    },
    countries: {
      type: Array as PropType<string[]>,
      required: true,
    },
    carriers: {
      type: Array as PropType<CustomCarrier[]>,
      required: true,
    },
    displayValidationErrors: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      RateType,
      cardWithAllCountriesIsVisible: true,
    };
  },
  computed: {
    countriesNames(): string[] {
      return this.$options.filters.changeCountriesCodesToNames(this.countries);
    },
  },
  methods: {
    validateCarrier(carrier): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      return validateCarrier(carrier);
    },
    carrierUpdated(carrierData: CustomCarrier, index: number): void {
      this.$emit(
        'dataUpdated',
        this.carriers.toSpliced(index, 1, {
          ...carrierData[index],
          ...carrierData,
        }),
      );
    },
  },
  watch: {
    carriers: {
      handler(carriers) {
        this.$emit('dataUpdated', carriers);
      },
    },
    countriesNames: {
      handler(newList) {
        if (newList.length === 1) {
          this.cardWithAllCountriesIsVisible = true;
        }
      },
    },
  },
});
</script>
