<template>
  <div>
    <p class="h3 mb-2 font-weight-600">
      {{ $t('productFeedSettings.deliveryTimeAndRates.title') }}
    </p>
    <target-countries
      @countrySelected="countries = $event"
      :countries="countries"
    />
    <shipping-settings
      :countries="countries"
    />

    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      :disable-continue="disableContinue"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import CreateCustomCarrier from '@/components/product-feed/settings/delivery-time-and-rates/create-custom-carrier.vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import ShippingSettingsHeaderType from '@/enums/product-feed/shipping-settings-header-type.ts';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import {validateDeliveryDetail} from '@/providers/shipping-settings-provider';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import TargetCountries from '@/components/product-feed/settings/delivery-time-and-rates/target-countries.vue';
import ShippingSettings from '@/components/product-feed/settings/delivery-time-and-rates/import-method/shipping-settings.vue';

export default Vue.extend({
  components: {
    ActionsButtons,
    TargetCountries,
    ShippingSettings,
  },
  data() {
    return {
      countryChosen: null,
      rateChosen: null,
      ShippingSetupOption,
    };
  },
  computed: {
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
    },
    countries(): string[] {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'];
    },
    hasMultipleCountries(): boolean {
      return this.countries.length > 1;
    },
    convertToCountryName(): string[] {
      return this.$options.filters.changeCountriesCodesToNames(this.countries);
    },
    getShippingValueSetup(): string|null {
      return getDataFromLocalStorage('productFeed-shippingSetup');
    },
    carriers() {
      return this.$store.state.productFeed.settings.deliveryDetails
        .filter((carrier) => {
          if (this.countryChosen) {
            return this.countryChosen === carrier.country;
          }
          return this.countries.includes(carrier.country);
        });
    },
    disableContinue() {
      return !this.carriers.every(validateDeliveryDetail);
    },
  },
  methods: {
    hasToolTip(headerType) {
      if (
        headerType === ShippingSettingsHeaderType.SHIP_TO_CUSTOMER
        || headerType === ShippingSettingsHeaderType.TRANSIT_TIME
      ) {
        return true;
      }
      return false;
    },
    hasHeader(headerType) {
      if (
        headerType === ShippingSettingsHeaderType.ACTION
      ) {
        return false;
      }
      return true;
    },
    getRate(value) {
      this.rateChosen = value;
    },
    previousStep() {
      localStorage.setItem('productFeed-deliveryDetails', JSON.stringify(this.carriers));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SHIPPING_SETUP,
        },
      });
      window.scrollTo(0, 0);
    },
    saveSelectedCountries() {
      localStorage.setItem('productFeed-targetCountries', JSON.stringify(this.countries));
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
        name: 'targetCountries', data: this.countries,
      });
    },
    nextStep() {
      this.$segment.track('[GGL] Product feed config - Step 2', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.saveSelectedCountries();
      localStorage.setItem('productFeed-deliveryDetails', JSON.stringify(this.carriers));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
        },
      });
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    refreshComponent() {
      this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS');
    },
  },
  mounted() {
    this.refreshComponent();
  },
});
</script>
