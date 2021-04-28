<template>
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.shipping.targetCountries')"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <p>
        {{ $t('productFeedSettings.shipping.ifMultipleCountries') }}
      </p>
      <label class="mb-2">
        {{ $t('productFeedSettings.shipping.productAvailaibleIn') }}
      </label>
      <ps-select
        v-model="selectedCountries"
        :placeholder="$t('productFeedSettings.shipping.placeholderSelect')"
        :reduce="country => country.code"
        :options="$options.countriesSelectionOptions"
        :deselect-from-dropdown="true"
        class="ps_gs-v-select maxw-sm-500"
        multiple
        label="country"

      />
      <p class="text-muted my-1 ps_gs-fz-12">
        {{ $t('productFeedSettings.shipping.cantFindCountry') }}
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
      :label="$t('productFeedSettings.shipping.shippingSettings')"
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
            {{ $t('productFeedSettings.shipping.autoImportShipping') }}
          </span>
          <p class="text-muted ps_gs-fz-12 mb-0">
            {{ $t('productFeedSettings.shipping.autoImportShippingDescription') }}
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
            {{ $t('productFeedSettings.shipping.manualShipping') }}
          </span>
          <p class="text-muted ps_gs-fz-12 mb-0">
            {{ $t('productFeedSettings.shipping.manualShippingDescription') }}
          </p>
        </div>
      </b-form-radio>
    </b-form-group>
    <b-form-group
      v-if="isUS"
      class="mt-4"
      :label="$t('productFeedSettings.shipping.taxSettings')"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <p>
        {{ $t('productFeedSettings.shipping.taxSettingsDescription') }}
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
            {{ $t('productFeedSettings.shipping.autoImportTax') }}
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
            {{ $t('productFeedSettings.shipping.manualImportTax') }}
          </span>
        </div>
      </b-form-radio>
    </b-form-group>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        size="sm"
        class="mx-2 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <b-button
        size="sm"
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
import PsSelect from '../commons/ps-select';
import countriesSelectionOptions from '../../assets/json/countries.json';

export default {
  name: 'ProductFeedSettingsShipping',
  components: {
    PsSelect,
  },
  data() {
    return {
      selectedCountries: [],
      selectedShippingSettings: null,
      selectedTaxSettings: null,
    };
  },
  methods: {
  },
  computed: {
    isUS() {
      return this.selectedCountries.includes('US');
    },
    disableContinue() {
      if (this.isUS && this.selectedTaxSettings === null) {
        return true;
      }
      return this.selectedCountries.length < 1 || this.selectedShippingSettings === null;
    },
  },
  countriesSelectionOptions,
};
</script>
