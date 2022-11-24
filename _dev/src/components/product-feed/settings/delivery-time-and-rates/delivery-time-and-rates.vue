<template>
  <div>
    <p class="h3 mb-2 font-weight-600">
      {{ $t('productFeedSettings.deliveryTimeAndRates.title') }}
    </p>

    <target-countries
      @countrySelected="countries = $event;dataUpdated()"
      :countries="selectedCountries"
      :shipping-setup-option="getShippingValueSetup"
    />

    <custom-rate
      v-if="getShippingValueSetup === ShippingSetupOption.ESTIMATE
        && selectedCountries.length > 0"
      :is-multiple-countries="selectedCountries.length"
      :rate-type-chosen="rateChosen"
      @rateUpdated="rateSelected($event)"
    />

    <shipping-settings
      v-if="getShippingValueSetup === ShippingSetupOption.IMPORT"
      :countries="selectedCountries"
      :carriers="carriersToConfigure"
      :display-validation-errors="displayValidationErrors"
      @dataUpdated="carriers = $event;dataUpdated()"
      @refresh="refreshComponent"
    />

    <countries-form-list
      v-else-if="getShippingValueSetup === ShippingSetupOption.ESTIMATE
        && selectedCountries.length > 0"
      :rate-chosen="rateChosen"
      :carriers="estimateCarriersToConfigure"
      :countries="selectedCountries"
      :display-validation-errors="displayValidationErrors"
      @dataUpdated="estimateCarriers = $event;dataUpdated()"
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
import {validateCarrier, createCustomCarriersTemplate, CustomCarrier} from '@/providers/shipping-rate-provider';
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
      rateChosen: getDataFromLocalStorage('productFeed-rateChosen') ?? this.$store.state.productFeed.settings.rate,
      estimateCarriers: [],
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
      const carriersFromStore = this.$store.getters['productFeed/GET_ESTIMATE_CARRIERS']?.filter((carrier) => carrier.rate === this.rateChosen);

      if (carriersFromStore.length === 0) {
        return createCustomCarriersTemplate(
          this.rateChosen,
          this.selectedCountries,
          this.getCurrency,
        );
      }

      return carriersFromStore;
    },
    selectedCountries(): string[] {
      return this.countries || this.$store.getters['productFeed/GET_TARGET_COUNTRIES'] || [];
    },
  },
  methods: {
    dataUpdated(): void {
      if (this.selectedCountries.length === 1 && this.rateChosen === RateType.RATE_PER_COUNTRY) {
        this.rateChosen = RateType.RATE_ALL_COUNTRIES;
      }
      this.displayValidationErrors = false;
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
      this.estimateCarriers = [];
    },
    validateForm(): boolean {
      this.displayValidationErrors = true;

      // Validation - Target countries
      if (!this.selectedCountries.length) {
        return false;
      }

      // Validation - Estimate option
      if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE) {
        if (!this.estimateCarriers.length) {
          return false;
        }

        if (!this.rateChosen) {
          return false;
        }

        if (!this.estimateCarriers.every(validateCarrier)) {
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
        this.estimateCarriers.forEach((c: CustomCarrier) => {
          c.rate = this.rateChosen;
        });
        localStorage.setItem('productFeed-estimateCarriers', JSON.stringify(this.estimateCarriers));
        localStorage.setItem('productFeed-rateChosen', JSON.stringify(this.rateChosen));
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
    if (this.getShippingValueSetup === ShippingSetupOption.IMPORT
    && !this.$store.state.productFeed.settings.deliveryDetails.length) {
      this.refreshComponent();
    }

    if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE
    && !this.$store.state.productFeed.settings.estimateCarriers.length) {
      this.refreshComponent();
    }

    if (this.selectedCountries.length === 1) {
      this.rateChosen = RateType.RATE_ALL_COUNTRIES;
    }
  },
});
</script>
