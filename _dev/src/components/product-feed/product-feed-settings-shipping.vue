<template>
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.shipping.targetCountries')"
      label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
    >
      <VueShowdown
        :markdown="$t('productFeedSettings.shipping.ifMultipleCountries', [
          $options.googleUrl.countrySpecificShoppingPolicies,
          $options.googleUrl.localRegulation
        ])"
        :extensions="['targetlink']"
      />
      <label class="mb-2">
        {{ $t('productFeedSettings.shipping.productAvailaibleIn') }}
      </label>
      <ps-select
        v-model="countries"
        :placeholder="$t('productFeedSettings.shipping.placeholderSelect')"
        :reduce="country => country.code"
        :options="$options.countriesSelectionOptions"
        :deselect-from-dropdown="true"
        class="ps_gs-v-select maxw-sm-500"
        multiple
        label="country"
      />
      <VueShowdown
        class="text-muted my-1 ps_gs-fz-12"
        :markdown="$t('productFeedSettings.shipping.cantFindCountry', [
          $options.googleUrl.supportedCountries
        ])"
        :extensions="['targetlink']"
      />
      <span
        v-if="error"
        class="text-muted ps_gs-fz-12"
        style="color:red;"
      >
        {{ error }}
      </span>
    </b-form-group>
    <b-form-group
      class="mt-4"
      :label="$t('productFeedSettings.shipping.shippingSettings')"
      label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
    >
      <b-form-radio
        :checked="shippingSettings"
        v-model="shippingSettings"
        name="shippingSettingsRadio"
        id="shippingSettingsAuto"
        :value="true"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.shipping.autoImportShipping') }}
          </span>
          <VueShowdown
            class="text-muted ps_gs-fz-12 mb-0"
            :markdown="$t('productFeedSettings.shipping.autoImportShippingDescription')"
          />
        </div>
      </b-form-radio>
      <b-form-radio
        :checked="!shippingSettings"
        v-model="shippingSettings"
        name="shippingSettingsRadio"
        id="shippingSettingsManual"
        :value="false"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.shipping.manualShipping') }}
          </span>
          <VueShowdown
            class="text-muted ps_gs-fz-12 mb-0"
            :markdown="$t('productFeedSettings.shipping.manualShippingDescription')"
          />
        </div>
      </b-form-radio>
    </b-form-group>
    <div
      v-if="isUS"
      class="pb-2"
    >
      <div class="d-flex flex-wrap align-items-center mb-3">
        <span class="h4 mb-0 font-weight-600 mr-1">
          {{ $t('productFeedSettings.shipping.taxSettings') }}
        </span>
        <span class="text-muted ps_gs-fz-12">
          {{ $t('productFeedSettings.shipping.appliedOnlyForUsa') }}
        </span>
      </div>
      <b-alert
        variant="warning"
        show
        class="mb-0"
      >
        <p>
          {{ $t('productFeedSettings.shipping.alertTaxes') }}
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
    <!-- Not in batch 1 -->
    <!--
    <b-form-group
      v-if="isUS"
      class="mt-4"
      :label="$t('productFeedSettings.shipping.taxSettings')"
      label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
    >
      <p>
        {{ $t('productFeedSettings.shipping.taxSettingsDescription') }}
      </p>
      <b-form-radio
        v-model="tax"
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
        v-model="tax"
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
    </b-form-group> -->
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        @click="cancel"
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <b-button
        @click="nextStep"
        size="sm"
        :disabled="disableContinue"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t('cta.continue') }}
      </b-button>
    </div>
    <product-feed-settings-footer />
  </b-form>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import PsSelect from '../commons/ps-select';
import countriesSelectionOptions from '../../assets/json/countries.json';
import ProductFeedSettingsFooter from './product-feed-settings-footer';

export default {
  name: 'ProductFeedSettingsShipping',
  components: {
    PsSelect,
    ProductFeedSettingsFooter,
  },
  data() {
    return {
      tax: null,
      error: null,
    };
  },
  computed: {
    countries: {
      get() {
        return this.$store.getters['productFeed/GET_ACTIVE_COUNTRIES'];
      },
      set(value) {
        const getLastCountrySelected = value.slice(-1)[0];
        if (this.isCompatibleWithCurrency(getLastCountrySelected) === undefined) {
          this.error = 'This country is not eligible with your currency';
          return;
        }
        this.error = null;
        this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {name: 'targetCountries', data: value});
      },
    },
    isUS() {
      return this.countries.includes('US');
    },
    taxSettingsWithMerchantId() {
      return `https://merchants.google.com/mc/tax/settings?a=${this.$store.state.accounts.googleMerchantAccount.id}`;
    },
    disableContinue() {
      /**
       * ! This condition will be used when
       * ! we'll be able to set taxSettings manually
       */
      // if (this.isUS && this.tax === null) {
      //   return true;
      // }
      return this.countries.length < 1 || this.shippingSettings === null;
    },
    shippingSettings: {
      get() {
        return this.$store.state.productFeed.settings.autoImportShippingSettings !== 'undefined'
          ? this.$store.state.productFeed.settings.autoImportShippingSettings : null;
      },
      set(value) {
        this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
          name: 'autoImportShippingSettings',
          data: value,
        });
      },
    },

  },
  methods: {
    nextStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 2);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    isCompatibleWithCurrency(countrySelected) {
      const currency = this.$store.getters['app/GET_CURRENT_CURRENCY'];
      const countriesFilteredByCurrency = countriesSelectionOptions.filter(
        (country) => country.currency === currency,
      );
      return countriesFilteredByCurrency.find((country) => country.code === countrySelected);
    },
  },
  countriesSelectionOptions,
  googleUrl,
};
</script>
