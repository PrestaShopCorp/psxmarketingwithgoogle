<template>
  <div>
    <target-countries
      @countrySelected="countries = $event;resetCarriers();dataUpdated();"
      :countries="selectedCountries"
      :shipping-setup-option="getShippingValueSetup"
    />

    <custom-rate
      v-if="getShippingValueSetup === ShippingSetupOption.ESTIMATE
        && selectedCountries.length > 0"
      :is-multiple-countries="(selectedCountries.length > 1)"
      :rate-type-chosen="selectedRate"
      @rateUpdated="rateSelected($event)"
    />

    <countries-form-list
      v-if="(getShippingValueSetup === ShippingSetupOption.ESTIMATE
        && selectedCountries.length > 0)"
      :rate-chosen="selectedRate"
      :carriers="estimateCarriersToConfigure"
      :countries="selectedCountries"
      :display-validation-errors="displayValidationErrors"
      @dataUpdated="estimateCarriers = $event;dataUpdated()"
    />

    <shipping-settings
      v-if="getShippingValueSetup === ShippingSetupOption.IMPORT"
      :countries="selectedCountries"
      :carriers="carriers || carriersToConfigure"
      :display-validation-errors="displayValidationErrors"
      @dataUpdated="carriers = $event;dataUpdated()"
      @refresh="refreshComponent"
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
import {validateCarrier, createCustomCarriersTemplate} from '@/providers/shipping-rate-provider';
import {DeliveryDetail, validateDeliveryDetail, validateEachCountryHasAtLeastOneCarrier} from '@/providers/shipping-settings-provider';
import CustomRate from '@/components/product-feed/settings/delivery-time-and-rates/estimate-method/custom-rate.vue';
import CountriesFormList from './estimate-method/countries-form-list.vue';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';

export default Vue.extend({
  components: {
    ActionsButtons,
    TargetCountries,
    ShippingSettings,
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
      // Estimate Option data
      rateChosen: null,
      estimateCarriers: null,
      // Import Option data
      carriers: null,
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
    carriersToConfigure() {
      const carriers = this.$store.state.productFeed.settings.deliveryDetails
        .filter(
          (carrier: DeliveryDetail) => this.selectedCountries.includes(carrier.country),
        );

      return carriers;
    },
    getCurrency(): string {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    estimateCarriersToConfigure() {
      return this.estimateCarriers
        || getDataFromLocalStorage('productFeed-estimateCarriers')
        || (this.$store.getters['productFeed/GET_ESTIMATE_CARRIERS']?.length
          ? this.$store.getters['productFeed/GET_ESTIMATE_CARRIERS']
          : null
        )
        || createCustomCarriersTemplate(
          this.selectedRate,
          this.selectedCountries,
          this.getCurrency,
        );
    },
    selectedRate(): RateType|null {
      return this.rateChosen || getDataFromLocalStorage('productFeed-rateChosen') || this.$store.state.productFeed.settings.rate;
    },
    selectedCountries(): string[] {
      return this.countries || this.$store.getters['productFeed/GET_TARGET_COUNTRIES'] || [];
    },
  },
  methods: {
    dataUpdated(): void {
      if (this.selectedCountries.length === 1 && this.selectedRate === RateType.RATE_PER_COUNTRY) {
        this.rateChosen = RateType.RATE_ALL_COUNTRIES;
      }
      this.displayValidationErrors = false;
    },
    resetCarriers(): void {
      if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE) {
        this.estimateCarriers = createCustomCarriersTemplate(
          this.selectedRate,
          this.selectedCountries,
          this.getCurrency,
        );
      }
      if (this.getShippingValueSetup === ShippingSetupOption.IMPORT) {
        this.carriers = this.carriersToConfigure.map((carrier: DeliveryDetail) => ({
          ...carrier,
          enabledCarrier: false,
          minTransitTimeInDays: undefined,
          maxTransitTimeInDays: undefined,
        }));
      }
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
    rateSelected(event) {
      this.rateChosen = event;
      this.estimateCarriers = createCustomCarriersTemplate(
        this.selectedRate,
        this.selectedCountries,
        this.getCurrency,
      );
    },
    validateForm(): boolean {
      this.displayValidationErrors = true;

      // Validation - Target countries
      if (!this.selectedCountries.length) {
        return false;
      }

      // Validation - Estimate option
      if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE) {
        if (!this.estimateCarriersToConfigure.length) {
          return false;
        }

        if (!this.selectedRate) {
          return false;
        }

        if (!this.estimateCarriersToConfigure.every(validateCarrier)) {
          return false;
        }

        return true;
      }

      // Validation - Import option
      if (this.getShippingValueSetup === ShippingSetupOption.IMPORT) {
        const enabledDeliveryDetails: DeliveryDetail[] = this.carriers || this.carriersToConfigure;

        // No carrier enabled
        if (!enabledDeliveryDetails.length) {
          return false;
        }

        // At least one carrier is not configured properly
        if (!enabledDeliveryDetails.every(validateDeliveryDetail)) {
          return false;
        }

        // Each target country has at least one carrier
        return validateEachCountryHasAtLeastOneCarrier(
          this.selectedCountries,
          enabledDeliveryDetails,
        );
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
        localStorage.setItem('productFeed-estimateCarriers', JSON.stringify(this.estimateCarriersToConfigure));
        localStorage.setItem('productFeed-rateChosen', JSON.stringify(this.selectedRate));
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
  watch: {
    getShippingValueSetup: {
      handler(newValue: string[]): void {
        if (newValue === ShippingSetupOption.IMPORT
        && (!this.$store.state.productFeed.settings.deliveryDetails.length
        || !this.$store.state.productFeed.settings.shippingSettings.length)) {
          this.refreshComponent();
        }

        if (newValue === ShippingSetupOption.ESTIMATE
        && !this.$store.state.productFeed.settings.estimateCarriers.length) {
          this.refreshComponent();
        }
      },
      immediate: true,
    },
  },
});
</script>
