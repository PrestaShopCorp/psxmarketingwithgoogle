<template>
  <div>
    <p class="h3 mb-2 font-weight-600">
      {{ $t('productFeedSettings.deliveryTimeAndRates.title') }}
    </p>
    <target-countries
      @countrySelected="countries = $event;dataUpdated()"
      :countries="countries"
      :shipping-setup-option="getShippingValueSetup"
    />
    <shipping-settings
      v-if="getShippingValueSetup === ShippingSetupOption.IMPORT"
      :countries="countries"
      :carriers="carriersToConfigure"
      :display-validation-errors="displayValidationErrors"
      @dataUpdated="carriers = $event;dataUpdated()"
      @refresh="refreshComponent"
    />

    <custom-carrier-form
      v-else-if="getShippingValueSetup === ShippingSetupOption.ESTIMATE && countries.length > 0"
      :carrier="customCarrier"
      :display-validation-errors="displayValidationErrors"
      @dataUpdated="dataUpdated"
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
import {validateCarrier} from '@/providers/shipping-rate-provider';
import {DeliveryDetail, validateDeliveryDetail} from '@/providers/shipping-settings-provider';
import CustomCarrierForm from '@/components/product-feed/settings/delivery-time-and-rates/estimate-method/custom-carrier-form.vue';

export default Vue.extend({
  components: {
    ActionsButtons,
    TargetCountries,
    ShippingSettings,
    CustomCarrierForm,
  },
  data() {
    return {
      countries: this.$store.getters['productFeed/GET_TARGET_COUNTRIES'],
      displayValidationErrors: false,
      ShippingSetupOption,
      RateType,
      OfferType,
      // Estimate Option data
      customCarrier: {
        carrierName: '',
        offerChosen: '' as OfferType,
        maxDeliveryTime: 0,
        minDeliveryTime: 0,
        [OfferType.FREE_SHIPPING_OVER_AMOUNT]: {
          shippingRateAmount: 0,
          freeShippingAmount: 0,
        },
        [OfferType.FLAT_SHIPPING_RATE]: {
          shippingRateAmount: 0,
        },
      },
      // Import Option data
      carriers: [],
    };
  },
  computed: {
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
    },
    hasMultipleCountries(): boolean {
      return this.countries.length > 1;
    },
    getShippingValueSetup(): ShippingSetupOption|null {
      return this.$store.getters['productFeed/GET_SHIPPING_SETUP'];
    },
    carriersToConfigure() {
      const carriers = this.$store.state.productFeed.settings.deliveryDetails
        .filter(
          (carrier: DeliveryDetail) => this.countries.includes(carrier.country),
        );

      return carriers;
    },
  },
  methods: {
    dataUpdated(): void {
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
    validateForm(): boolean {
      this.displayValidationErrors = true;

      // Validation - Target countries
      if (!this.countries.length) {
        return false;
      }

      // Validation - Estimate option
      if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE) {
        if (validateCarrier(this.customCarrier) === false) {
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
        return this.countries.every((country: string) => enabledDeliveryDetails.find(
          (deliveryDetail: DeliveryDetail) => deliveryDetail.country === country,
        ));
      }

      return false;
    },
    saveSelectedCountries(): void {
      localStorage.setItem('productFeed-targetCountries', JSON.stringify(this.countries));
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
        name: 'targetCountries', data: this.countries,
      });
    },
    saveCarriersDetails(): void {
      if (this.getShippingValueSetup === ShippingSetupOption.ESTIMATE) {
        localStorage.setItem('productFeed-customCarrier', JSON.stringify(this.customCarrier));
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
    this.refreshComponent();
  },
});
</script>
