<template>
  <b-form>
    <b-form-group>
      <label class="h4 font-weight-600 mb-2 d-flex p-0 bg-transparent border-0 d-flex">
        {{ $t('productFeedSettings.shipping.targetCountries') }}
        <b-button
          class="ml-1 p-0  align-items-center "
          variant="text-primary"
          v-b-tooltip:psxMktgWithGoogleApp
          :title="$t('productFeedSettings.inputTargetCountriesTooltip')"
        >
          <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
            info_outlined
          </span>
        </b-button>
      </label>
      <label class="mb-2">
        {{ $t('productFeedSettings.shipping.productAvailaibleIn') }}
      </label>
      <SelectCountry
        @countrySelected="saveCountrySelected"
        :default-value="countries"
        :dropdown-options="activeCountriesWhereShipppingExist"
        :need-filter="true"
        :not-full-width="false"
        :loader="loadingCountries"
        type="targetCountries"
      />
      <div
        class="text-primary"
      >
        <a
          class="ps_gs-fz-12 mb-0 text-primary"
          :href="$store.getters['app/GET_CARRIERS_URL']"
          target="_blank"
        >
          {{ $t('productFeedSettings.shipping.addNewCarriers') }}
        </a>
        <span class="ps_gs-fz-12 text-dark">
          |
        </span>
        <b-button
          variant="link"
          class="ps_gs-fz-12 font-weight-normal p-0 border-0
        text-decoration-underline text-wrap text-left"
          @click="refreshComponent"
        >
          {{ $t('general.refreshPage') }}
          <i class="material-icons ps_gs-fz-12">refresh</i>
        </b-button>
      </div>
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
    <actions-buttons
      :next-step="nextStep"
      :disable-continue="disableContinue"
      :disable-tooltip="$t('productFeedSettings.shipping.disabledButtonTooltipTargetCountries')"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
    <settings-footer />
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
      loadingCountries: true,
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
    availableCountries() {
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES_FOR_ACTIVE_CURRENCY'];
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
    activeCountriesWhereShipppingExist() {
      const arrayOfCountries = [];

      this.$store.state.productFeed.settings.deliveryDetails.forEach((carrier) => {
        availableCountries.forEach((country) => {
          if (country.code === carrier.country) {
            arrayOfCountries.push(carrier.country);
          }
        });
      });
      const uniqueCountries = [...new Set(arrayOfCountries)];

      return this.$options.filters.changeCountriesCodesToNames(uniqueCountries);
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
    refreshComponent() {
      this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS');
    },
  },
  mounted() {
    this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS').then(() => {
      this.loadingCountries = false;
    }).catch((error) => {
      console.error(error);
      this.loadingCountries = false;
    });
  },

};
</script>
