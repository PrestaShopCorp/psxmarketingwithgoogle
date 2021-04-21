<template>
  <b-form>
    <b-form-group
      label="Target countries"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <p>
        If multiple countries are selected, each product price will automatically be converted to the correct currency in Google. Your store must support the appropriate shipping and tax rates for customers in each selected country.
      </p>
      <label class="mb-2">
        Products available in
      </label>
      <v-select
        placeholder="Select countries of destination"
        :reduce="country => country.code"
        :options="$options.countriesSelectionOptions"
        :deselectFromDropdown="true"
        class="ps_gs-v-select"
        multiple
        label="country"
        @input="pushSelectedCountries"
      />
      <p class="text-muted my-1 ps_gs-fz-12">
        Can’t find a country? Only supported countries are listed.
        <a class="d-inline-block" href="//google.com" target="_blank">Supported countries</a>
      </p>
    </b-form-group>
    <b-form-group
      class="mt-4"
      label="Shipping settings"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <b-form-radio
        v-model="selectedShippingSettings"
        name="shippingSettingsRadio"
        id="shippingSettingsAuto"
        value="shippingSettingsAuto"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">Automatically import shipping settings</span>
          <p class="text-muted ps_gs-fz-12 mb-0">
            PrestaShop will try to automatically import your shipping information from your store settings. You may need to provide additional information if we are unable to sync them automatically.
          </p>
        </div>
      </b-form-radio>
      <b-form-radio
        v-model="selectedShippingSettings"
        name="shippingSettingsRadio"
        id="shippingSettingsManual"
        value="shippingSettingsManual"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">Manually set up shipping settings in Google Merchant Center</span>
          <p class="text-muted ps_gs-fz-12 mb-0">
            You will go to Google Merchant Center and enter your product shipping information yourself. Your products won’t sync until you do this.
          </p>
        </div>
      </b-form-radio>
    </b-form-group>
    <b-form-group
      v-if="isUS"
      class="mt-4"
      label="Tax settings"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <p>
        So that users understand the exact price that they’ll have to pay for a product, you must submit the taxes that you collect. Select how you want to set up tax settings.
      </p>
      <b-form-radio
        v-model="selectedTaxSettings"
        name="taxSettingsRadio"
        id="taxSettingsAuto"
        value="taxSettingsAuto"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">Automatically import tax settings</span>
        </div>
      </b-form-radio>
      <b-form-radio
        v-model="selectedTaxSettings"
        name="taxSettingsRadio"
        id="taxSettingsManual"
        value="taxSettingsManual"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">Manually set up tax settings in Google Merchant Center</span>
        </div>
      </b-form-radio>
    </b-form-group>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        class="mx-2 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        Cancel
      </b-button>
      <b-button
        disabled
        class="mx-2 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        Continue
      </b-button>
    </div>
  </b-form>
</template>

<script>
import vSelect from 'vue-select'

import countriesSelectionOptions from '../../assets/json/countries.json';

export default {
  name: 'ProductFeedSettingsShipping',
  components: {
    vSelect
  },
  data() {
    return {
      selectedCountries: null,
      selectedShippingSettings: null,
      selectedTaxSettings: null,
      isUS: false,
    };
  },
  methods: {
    pushSelectedCountries(event) {
      this.selectedCountries = event;
      this.selectedCountries.includes('US') ? this.isUS = true : this.isUS = false;
    },
  },
  countriesSelectionOptions,
};
</script>
