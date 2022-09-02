<template>
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.deliveryTimeAndRates.targetCountries')"
      label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
    >
      <label class="mb-2">
        {{ $t('productFeedSettings.deliveryTimeAndRates.productAvailaibleIn') }}
      </label>
      <p class="mb-2 ps_gs-fz-12 font-italic text-muted">
        {{ $t('productFeedSettings.submissionExplanation') }}
      </p>
      <SelectCountry
        @countrySelected="countrySelected"
        :default-value="countriesNames"
        :dropdown-options="activeCountriesWithCurrency"
        :need-filter="true"
        :not-full-width="true"
      />
    </b-form-group>

    <div
      v-if="isUS"
      class="pb-2"
    >
      <div class="d-flex flex-wrap align-items-center mb-3">
        <span class="h4 mb-0 font-weight-600 mr-1">
          {{ $t('productFeedSettings.deliveryTimeAndRates.taxSettings') }}
        </span>
        <span class="text-muted ps_gs-fz-12">
          {{ $t('productFeedSettings.deliveryTimeAndRates.appliedOnlyForUsa') }}
        </span>
      </div>
      <b-alert
        variant="warning"
        show
        class="mb-0"
      >
        <p>
          {{ $t('productFeedSettings.deliveryTimeAndRates.alertTaxes') }}
        </p>
        <div>
          <b-button
            target="_blank"
            :href="taxSettingsWithMerchantId"
            variant="secondary"
            class="mt-2"
          >
            {{ $t('cta.setupTax') }}
          </b-button>
        </div>
      </b-alert>
    </div>
  </b-form>
</template>

<script lang="ts">
import {PropType} from '@vue/composition-api';
import SelectCountry from '@/components/commons/select-country.vue';

export default {
  name: 'ProductFeedSettingsShipping',
  components: {
    SelectCountry,
  },
  props: {
    // Countries iso codes
    countries: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      tax: null,
      shippingSettings: JSON.parse(localStorage.getItem('productFeed-autoImportShippingSettings')) ?? this.$store.state.productFeed.settings.autoImportShippingSettings,
      loading: false,
    };
  },
  computed: {
    countriesNames() {
      return this.$options.filters.changeCountriesCodesToNames(
        this.countries,
      );
    },
    currency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    isUS() {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'].includes('US');
    },
    taxSettingsWithMerchantId() {
      return `https://merchants.google.com/mc/tax/settings?a=${this.$store.state.accounts.googleMerchantAccount.id}`;
    },
    disableContinue() {
      return this.countries.length < 1 || this.loading;
    },
    activeCountriesWithCurrency() {
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES_FOR_ACTIVE_CURRENCY'];
    },
  },
  methods: {
    countrySelected(newValue) {
      this.$emit(
        'countrySelected',
        this.$options.filters.changeCountriesNamesToCodes(newValue),
      );
    },
  },
};
</script>
