<template>
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.targetCountries')"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <p>
        {{ $t('productFeedSettings.ifMultipleCountries') }}
      </p>
      <label class="mb-2">
        {{ $t('productFeedSettings.productAvailaibleIn') }}
      </label>
      <v-select
        :placeholder="$t('productFeedSettings.placeholderSelect')"
        :reduce="country => country.code"
        :options="$options.countriesSelectionOptions"
        :deselect-from-dropdown="true"
        class="ps_gs-v-select"
        multiple
        label="country"
        @input="pushSelectedCountries"
      />
      <p class="text-muted my-1 ps_gs-fz-12">
        {{ $t('productFeedSettings.cantFindCountry') }}
        <a
          class="d-inline-block"
          href="//google.com"
          target="_blank"
        >
          {{ $t('cta.supportedCountries') }}
        </a>
      </p>
    </b-form-group>
    <b-form-group
      class="mt-4"
      :label="$t('productFeedSettings.shippingSettings')"
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
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.autoImportShipping') }}
          </span>
          <p class="text-muted ps_gs-fz-12 mb-0">
            {{ $t('productFeedSettings.autoImportShippingDescription') }}
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
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.manualShipping') }}
          </span>
          <p class="text-muted ps_gs-fz-12 mb-0">
            {{ $t('productFeedSettings.manualShippingDescription') }}
          </p>
        </div>
      </b-form-radio>
    </b-form-group>
    <b-form-group
      v-if="isUS"
      class="mt-4"
      :label="$t('productFeedSettings.taxSettings')"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <p>
        {{ $t('productFeedSettings.taxSettingsDescription') }}
      </p>
      <b-form-radio
        v-model="selectedTaxSettings"
        name="taxSettingsRadio"
        id="taxSettingsAuto"
        value="taxSettingsAuto"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.autoImportTax') }}
          </span>
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
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.manualImportTax') }}
          </span>
        </div>
      </b-form-radio>
    </b-form-group>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        class="mx-2 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <b-button
        :disabled="disableContinue"
        class="mx-2 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t('cta.continue') }}
      </b-button>
    </div>
  </b-form>
</template>

<script>
import vSelect from 'vue-select';

import countriesSelectionOptions from '../../assets/json/countries.json';

export default {
  name: 'ProductFeedSettingsShipping',
  components: {
    vSelect,
  },
  data() {
    return {
      selectedCountries: [],
      selectedShippingSettings: null,
      selectedTaxSettings: null,
      isUS: false,
    };
  },
  methods: {
    pushSelectedCountries(event) {
      this.selectedCountries = event;
      if (this.selectedCountries.includes('US')) {
        this.isUS = true;
      } else {
        this.isUS = false;
      }
    },
  },
  computed: {
    disableContinue() {
      if (this.isUS) {
        if (
          this.selectedCountries.length >= 1
          && this.selectedShippingSettings !== null
          && this.selectedTaxSettings !== null
        ) {
          return false;
        }

        return true;
      }

      if (this.selectedCountries.length >= 1 && this.selectedShippingSettings !== null) {
        return false;
      }

      return true;
    },
  },
  countriesSelectionOptions,
};
</script>
