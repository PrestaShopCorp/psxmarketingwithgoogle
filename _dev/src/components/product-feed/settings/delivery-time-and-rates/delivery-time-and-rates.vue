<template>
  <div>
    <p class="h3 mb-2 font-weight-600">
      {{ $t('productFeedSettings.deliveryTimeAndRates.title') }}
    </p>
    <custom-rate
      :is-multiple-countries="2"
      @rateTypeChosen="updateRate($event)"
    />
    <target-countries
      @countrySelected="countries = $event;dataUpdated()"
      :countries="selectedCountries"
      :shipping-setup-option="getShippingValueSetup"
    />
    <shipping-settings
      v-if="getShippingValueSetup === ShippingSetupOption.IMPORT"
      :countries="selectedCountries"
      :carriers="carriersToConfigure"
      :display-validation-errors="displayValidationErrors"
      @dataUpdated="carriers = $event;dataUpdated()"
      @refresh="refreshComponent"
    />
<!--
    <custom-carrier-form
      v-else-if="getShippingValueSetup === ShippingSetupOption.ESTIMATE
        && selectedCountries.length > 0
        && rate === RateType.SAME_FOR_ALL"
      :custom-carrier="customCarrier"
      :display-validation-errors="displayValidationErrors"
    /> -->

    <countries-form-list
      v-else-if="getShippingValueSetup === ShippingSetupOption.ESTIMATE  && selectedCountries.length > 0"
      :rateChosen="rate"
      :countries="['FR', 'IT']"
      :validation-error="displayValidationErrors"
      @dataUpdated="carriersCustom = $event;dataUpdated()"
    />

    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import ShippingSettingsHeaderType from '@/enums/product-feed/shipping-settings-header-type';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import TargetCountries from '@/components/product-feed/settings/delivery-time-and-rates/target-countries.vue';
import ShippingSettings from '@/components/product-feed/settings/delivery-time-and-rates/import-method/shipping-settings.vue';
import {RateType} from '@/enums/product-feed/rate';
import {OfferType} from '@/enums/product-feed/offer';
import {CustomCarrier, validateCarrier} from '@/providers/shipping-rate-provider';
import {DeliveryDetail, validateDeliveryDetail} from '@/providers/shipping-settings-provider';
import CustomCarrierForm from '@/components/product-feed/settings/delivery-time-and-rates/estimate-method/custom-carrier-form.vue';
import CustomRate from '@/components/product-feed/settings/delivery-time-and-rates/estimate-method/custom-rate.vue';
import CountriesFormList from './estimate-method/countries-form-list.vue';

export default Vue.extend({
  components: {
    ActionsButtons,
    TargetCountries,
    ShippingSettings,
    CustomCarrierForm,
    CustomRate,
    CountriesFormList,
  },
  data() {
    return {
      countries: null,
      displayValidationErrors: false,
      ShippingSetupOption,
      RateType,
      OfferType,
      rate: '',
      carriersCustom: [],
      // Import Option data
      carriers: [],
    };
  },
  computed: {
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
    },
    hasMultipleCountries(): boolean {
      return this.selectedCountries.length > 1;
    },
    getShippingValueSetup(): ShippingSetupOption|null {
      return this.$store.getters['productFeed/GET_SHIPPING_SETUP'];
    },
    // Estimate Option data
    customCarrier: {
      get(): CustomCarrier {
        return this.$store.getters['productFeed/GET_ESTIMATE_CARRIER'];
      },
      set(value) {
        this.$store.state.productFeed.settings.estimateCarrier = value;
      },
    },
    carriersToConfigure() {
      const carriers = this.$store.state.productFeed.settings.deliveryDetails
        .filter(
          (carrier: DeliveryDetail) => this.selectedCountries.includes(carrier.country),
        );

      return carriers;
    },
    getCurrency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    selectedCountries(): string[] {
      return this.countries || this.$store.getters['productFeed/GET_TARGET_COUNTRIES'] || [];
    },
  },
  methods: {
    dataUpdated(): void {
      this.displayValidationErrors = false;
    },
    updateRate(event) {
      this.rate = event;
      this.dataUpdated();
    },
    previousStep(): void {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SHIPPING_SETUP,
        },
      });
      window.scrollTo(0, 0);
    },
    validateForm(): boolean {
      this.displayValidationErrors = true;

      // Validation - Target countries
      if (!this.selectedCountries.length) {
        return false;
      }

      // Validation - Estimate option
      if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE) {
        if (validateCarrier(this.carriersCustom) === false) {
          return false;
        }
        return true;
      }

      // Validation - Import option
      if (this.getShippingValueSetup === ShippingSetupOption.IMPORT) {
        const enabledDeliveryDetails: DeliveryDetail[] = this.carriers.filter(
          (e: DeliveryDetail) => e.enabledCarrier,
        );

        // No carrier enabled
        if (!enabledDeliveryDetails.length) {
          return false;
        }

        // At least one carrier is not configured properly
        if (!enabledDeliveryDetails.every(validateDeliveryDetail)) {
          return false;
        }

        // Each target country has at least one carrier
        return this.selectedCountries.every((country: string) => enabledDeliveryDetails.find(
          (deliveryDetail: DeliveryDetail) => deliveryDetail.country === country,
        ));
      }

      return false;
    },
    saveSelectedCountries(): void {
      localStorage.setItem('productFeed-targetCountries', JSON.stringify(this.selectedCountries));
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
        name: 'targetCountries', data: this.selectedCountries,
      });
    },
    saveCarriersDetails(): void {
      if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE) {
        (this.customCarrier as CustomCarrier).currency = this.getCurrency;
        (this.customCarrier as CustomCarrier).countries = this.selectedCountries;
        localStorage.setItem('productFeed-estimateCarriers', JSON.stringify([this.customCarrier]));
      } else if (this.getShippingValueSetup === ShippingSetupOption.IMPORT) {
        localStorage.setItem('productFeed-deliveryDetails', JSON.stringify(this.carriers));
      }
    },
    nextStep(): void {
      if (this.validateForm() === false) {
        return;
      }

      this.saveSelectedCountries();
      this.saveCarriersDetails();

      this.$segment.track('[GGL] Product feed config - Step 2', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
        },
      });
      window.scrollTo(0, 0);
    },
    cancel(): void {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    refreshComponent(): void {
      this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS');
    },
  },
  mounted() {
    if (!this.$store.state.productFeed.settings.deliveryDetails.length) {
      this.refreshComponent();
    }
  },
});
</script>
