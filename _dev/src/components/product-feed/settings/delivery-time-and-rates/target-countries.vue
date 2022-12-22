<template>
  <b-form>
    <b-form-group
      :label="$tc('productFeedSettings.deliveryTimeAndRates.targetCountries', 3)"
      label-class="title-size-h3 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
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
        :dropdown-options="selectableCountriesList"
        :need-filter="true"
        :not-full-width="true"
        :multiple-countries="true"
      />
    </b-form-group>

    <div
      v-if="isUS && shippingSetupOption"
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
            data-test-id="configureTax"
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
import {DeliveryDetail} from '@/providers/shipping-settings-provider';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {changeCountriesCodesToNames, changeCountriesNamesToCodes} from '@/utils/Countries';

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
    shippingSetupOption: {
      type: String as PropType<ShippingSetupOption>,
      required: false,
      default: null,
    },
  },
  computed: {
    countriesNames() {
      return changeCountriesCodesToNames(this.countries);
    },
    isUS() {
      return this.countries.includes('US');
    },
    taxSettingsWithMerchantId() {
      return `https://merchants.google.com/mc/tax/settings?a=${this.$store.state.accounts.googleMerchantAccount.id}`;
    },
    selectableCountriesList() {
      if (this.shippingSetupOption === ShippingSetupOption.ESTIMATE) {
        return this.activeCountriesWithCurrency;
      }

      if (this.shippingSetupOption === ShippingSetupOption.IMPORT) {
        return this.activeCountriesWhereShipppingExist;
      }
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES'];
    },
    activeCountriesWithCurrency(): string[] {
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES_FOR_ACTIVE_CURRENCY'];
    },
    activeCountriesWhereShipppingExist(): string[] {
      const arrayOfCountries: string[] = [];
      this.$store.state.productFeed.settings.deliveryDetails.forEach((carrier: DeliveryDetail) => {
        if (!carrier.country.length) {
          return;
        }
        arrayOfCountries.push(carrier.country);
      });
      const uniqueCountries = [...new Set(arrayOfCountries)];
      const uniqueCountriesNames = changeCountriesCodesToNames(
        uniqueCountries,
      );

      return uniqueCountriesNames.filter(
        (countryName) => this.activeCountriesWithCurrency.indexOf(countryName) !== -1,
      );
    },
  },
  methods: {
    countrySelected(newValue: string[]|null) {
      if (newValue) {
        this.$emit('countrySelected', changeCountriesNamesToCodes(newValue));
        return;
      }
      this.$emit('countrySelected', null);
    },
  },
  watch: {
    countries: {
      handler(newListOfCountries: string[]): void {
        // By loading an existing configuration, we may have some selected that are
        // not anymore in the list of possible values.
        // When this happens, we remove them and notify the parent.
        const validCountries: string[] = this.countriesNames.filter(
          (country: string) => this.selectableCountriesList.includes(country),
        );

        if (validCountries.length !== newListOfCountries.length) {
          this.countrySelected(validCountries.length ? validCountries : null);
        }
      },
      immediate: true,
    },
  },
};
</script>
