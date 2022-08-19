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
        @countrySelected="saveCountrySelected"
        :default-value="countries"
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

<script>
import {VueShowdown} from 'vue-showdown';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import SelectCountry from '@/components/commons/select-country.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'ProductFeedSettingsShipping',
  components: {
    SettingsFooter,
    VueShowdown,
    SelectCountry,
    ActionsButtons,
  },
  data() {
    return {
      tax: null,
      shippingSettings: JSON.parse(localStorage.getItem('productFeed-autoImportShippingSettings')) ?? this.$store.state.productFeed.settings.autoImportShippingSettings,
      loading: false,
    };
  },
  computed: {
    countries() {
      return this.$options.filters.changeCountriesCodesToNames(
        this.$store.getters['productFeed/GET_TARGET_COUNTRIES'],
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
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    nextStep() {
      this.loading = true;
      localStorage.setItem('productFeed-autoImportShippingSettings', JSON.stringify(this.shippingSettings));
      if (this.shippingSettings) {
        this.$segment.track('[GGL] Product feed config - Step 1 with Config my shipping settings now', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,
        });
        this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS').then(() => {
          this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
            name: 'autoImportShippingSettings',
            data: true,
          });
          this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 2);
          this.$router.push({
            name: 'product-feed-settings',
            params: {
              step: ProductFeedSettingsPages.SHIPPING_SETTINGS
              ,
            },
          });
          window.scrollTo(0, 0);
        });
      } else {
        this.$segment.track('[GGL] Product feed config - Step 1 with Config my shipping settings later', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,
        });
        this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
          name: 'autoImportShippingSettings',
          data: false,
        });
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
        this.$router.push({
          name: 'product-feed-settings',
          params: {
            step: ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
          },
        });
        window.scrollTo(0, 0);
      }
    },
    saveCountrySelected(value) {
      const countryCode = this.$options.filters.changeCountriesNamesToCodes(value);
      localStorage.setItem('productFeed-targetCountries', JSON.stringify(countryCode));
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
        name: 'targetCountries', data: countryCode,
      });
    },
  },

};
</script>
