<template>
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.shipping.targetCountries')"
      label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
    >
      <label class="mb-2">
        {{ $t('productFeedSettings.shipping.productAvailaibleIn') }}
      </label>
      <SelectCountry
        :currency="currency"
        @countrySelected="saveCountrySelected"
        :default-country="countries"
      />
    </b-form-group>
    <b-form-group
      class="mt-4"
      :label="$t('productFeedSettings.shipping.shippingSettingsTitle')"
      label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
    >
      <b-form-radio
        data-test-id="radioButton"
        v-model="shippingSettings"
        name="shippingSettingsRadio"
        :value="true"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.shipping.shippingLabel1') }}
          </span>
          <VueShowdown
            class="text-muted ps_gs-fz-12 mb-0"
            :markdown="$t('productFeedSettings.shipping.shippingDescription1')"
          />
        </div>
      </b-form-radio>
      <b-form-radio
        v-model="shippingSettings"
        name="shippingSettingsRadio"
        :value="false"
        class="mb-2"
      >
        <div>
          <span class="font-weight-normal mb-1">
            {{ $t('productFeedSettings.shipping.shippingLabel2') }}
          </span>
          <VueShowdown
            class="text-muted ps_gs-fz-12 mb-0"
            :markdown="$t('productFeedSettings.shipping.shippingDescription2')"
          />
        </div>
      </b-form-radio>
      <div
        class="d-flex align-items-center"
      >
        <i class="material-icons-round ps_gs-fz-14 text-secondary mr-2">warning_amber</i>
        <p class="ps_gs-fz-12 mb-0">
          {{ $t('productFeedSettings.shipping.noticeSetupShipping') }}
        </p>
      </div>
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
        data-test-id="continueButton"
        @click="nextStep"
        size="sm"
        :disabled="disableContinue"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t('cta.saveAndContinue') }}
      </b-button>
    </div>
    <settings-footer />
  </b-form>
</template>

<script>
import {VueShowdown} from 'vue-showdown';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import SelectCountry from '@/components/commons/select-country.vue';

export default {
  name: 'ProductFeedSettingsShipping',
  components: {
    SettingsFooter,
    VueShowdown,
    SelectCountry,
  },
  data() {
    return {
      tax: null,
      shippingSettings: true,
      loading: false,
    };
  },
  computed: {
    countries: {
      get() {
        return this.$options.filters.changeCountriesCodesToNames(
          this.$store.getters['app/GET_ACTIVE_COUNTRIES'],
        );
      },
    },
    currency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    isUS() {
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES'].includes('US');
    },
    taxSettingsWithMerchantId() {
      return `https://merchants.google.com/mc/tax/settings?a=${this.$store.state.accounts.googleMerchantAccount.id}`;
    },
    disableContinue() {
      return this.countries.length < 1 || this.loading;
    },

  },
  methods: {
    nextStep() {
      this.loading = true;
      if (this.shippingSettings) {
        this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS').then(() => {
          this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 2);
          window.scrollTo(0, 0);
        });
      } else {
        this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
          name: 'autoImportShippingSettings',
          data: false,
        });
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
        window.scrollTo(0, 0);
      }
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    saveCountrySelected(value) {
      this.$store.commit('app/SET_SELECTED_TARGET_COUNTRY', value);
    },
  },
};
</script>
