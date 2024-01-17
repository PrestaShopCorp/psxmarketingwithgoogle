<template>
  <b-row
    no-gutters
    class="mx-n1"
  >
    <b-col
      :cols="displayAttributeMappingSimpleCard ? 7 : null"
    >
      <product-feed-card-report-card
        :basic-display="displayAttributeMappingSimpleCard"
        :status="shippingSetupStatus"
        :title="$t('productFeedSettings.deliveryTimeAndRates.shippingSettings')"
        :description="shippingSetupDescription"
        :link="$t('cta.editSettings')"
        :link-to="{ name: 'product-feed-settings',
                    step: 1, params: ProductFeedSettingsPages.SHIPPING_SETUP }"
      />
      <product-feed-card-report-card
        v-if="displayAttributeMappingSimpleCard"
        :basic-display="displayAttributeMappingSimpleCard"
        :status="targetCountriesStatus"
        :title="$t('productFeedSettings.deliveryTimeAndRates.title')"
        :sub-title="$tc(
          'productFeedSettings.deliveryTimeAndRates.targetCountries',
          targetCountries.length,
        )"
        :description="targetCountries.join(', ')"
        :sub-title2="$t('productFeedSettings.deliveryTimeAndRates.title')"
        :description2="deliveryTimeAndRatesDescription"
        :link="$t('cta.editSettings')"
        :link-to="{ name: 'product-feed-settings',
                    step: 2, params: ProductFeedSettingsPages.SHIPPING_SETTINGS }"
      />
      <product-feed-card-report-card
        :basic-display="displayAttributeMappingSimpleCard"
        v-if="isUS"
        :status="taxSettingsStatus"
        :title="$t('productFeedSettings.deliveryTimeAndRates.taxSettings')"
        :description="taxSettings"
        :link="$t('cta.editSettings')"
        :link-to="{ name: 'product-feed-settings',
                    step: 1, params: ProductFeedSettingsPages.SHIPPING_SETUP }"
      />
      <product-feed-card-report-card
        :basic-display="displayAttributeMappingSimpleCard"
        v-if="displaySyncCard"
        status="success"
        :title="$t('productFeedSettings.summary.dataSyncSetUp')"
        :description="getSyncSchedule"
      />
      <product-feed-card-report-card
        v-if="displayAttributeMappingSimpleCard"
        :basic-display="displayAttributeMappingSimpleCard"
        :status="attributeMappingStatus"
        :title="$t('productFeedSettings.steps.attributeMapping')"
        :description="attributeMapping.join(', ')"
        :link="$t('cta.editProductAttributes')"
        :link-to="{ name: 'product-feed-settings',
                    step: 3, params: ProductFeedSettingsPages.ATTRIBUTE_MAPPING}"
      />
    </b-col>
    <b-col
      v-if="!displayAttributeMappingSimpleCard"
      class="d-flex flex-row-column"
    >
      <product-feed-card-report-card
        :basic-display="displayAttributeMappingSimpleCard"
        :status="targetCountriesStatus"
        :title="$t('productFeedSettings.deliveryTimeAndRates.title')"
        :sub-title="$tc(
          'productFeedSettings.deliveryTimeAndRates.targetCountries',
          targetCountries.length,
        )"
        :description="targetCountries.join(', ')"
        :sub-title2="$t('productFeedSettings.deliveryTimeAndRates.title')"
        :description2="deliveryTimeAndRatesDescription"
        :link="$t('cta.editSettings')"
        :link-to="{ name: 'product-feed-settings',
                    step: 2, params: ProductFeedSettingsPages.SHIPPING_SETTINGS }"
      />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import ProductFeedCardReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {changeCountryCodeToName, getCurrencyFromCountry} from '@/utils/Countries';

export default defineComponent({
  name: 'ProductFeedSummaryCards',
  components: {

    ProductFeedCardReportCard,
  },
  data() {
    return {
      ProductFeedSettingsPages,
    };
  },
  props: {
    displayAttributeMappingSimpleCard: {
      type: Boolean,
      required: false,
      default: true,
    },
    displaySyncCard: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    getProductFeedSettings() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_SETTINGS'];
    },
    isUS() {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'].includes('US');
    },
    getSyncSchedule() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'].syncSchedule;
    },
    targetCountries(): string[] {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'].map((country: string) => this.$t(
        'general.countryWithCurrencyFormat',
        {
          country: changeCountryCodeToName(country),
          currency: getCurrencyFromCountry(country),
        },
      ));
    },
    shippingSetupDescription() {
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return this.$t('productFeedSettings.shippingSetup.laterOption.summary');
      }

      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.IMPORT
        // Backward compatibility
        || this.getProductFeedSettings.autoImportShippingSettings
      ) {
        return this.$t('productFeedSettings.shippingSetup.importOption.summary');
      }
      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.ESTIMATE) {
        return this.$t('productFeedSettings.shippingSetup.estimateOption.summary');
      }

      return this.$t('productFeedCard.missingInformation');
    },
    shippingSetupStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']
        ? 'warning'
        : 'success';
    },
    deliveryTimeAndRatesDescription() {
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return '--';
      }

      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.IMPORT
        // Backward compatibility
        || this.getProductFeedSettings.autoImportShippingSettings
      ) {
        return this.$t('productFeedSettings.deliveryTimeAndRates.importOption.summary');
      }
      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.ESTIMATE) {
        if (this.targetCountries.length === 1) {
          return this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.summary.singleCountry');
        }
        return this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.summary.multiCountriesFlatRateForAll');
      }

      return this.$t('productFeedCard.missingInformation');
    },
    targetCountriesStatus() {
      return this.targetCountries.length ? 'success' : 'warning';
    },
    getAttributeMapping() {
      return this.$store.getters['productFeed/GET_ATTRIBUTE_MAPPING'];
    },
    attributeMappingStatus() {
      return this.getAttributeMapping ? 'success' : 'warning';
    },
    taxSettings() {
      if (this.getProductFeedSettings.autoImportTaxSettings === undefined) {
        return this.$t('productFeedCard.missingInformation');
      }
      return this.getProductFeedSettings.autoImportTaxSettings
        ? this.$t('productFeedSettings.deliveryTimeAndRates.automatically')
        : this.$t('productFeedSettings.deliveryTimeAndRates.manually');
    },
    taxSettingsStatus() {
      // TODO BATCH 2
      // TODO retrieve tax settings from backend
      return 'success';
    },
    attributeMapping() {
      const arr = [];
      const getMapping = this.getAttributeMapping;
      Object.keys(getMapping).forEach((key) => {
        if (getMapping[key]) {
          getMapping[key].forEach((item) => arr.push(item.id));
        }
      });
      return arr;
    },
  },
});
</script>
