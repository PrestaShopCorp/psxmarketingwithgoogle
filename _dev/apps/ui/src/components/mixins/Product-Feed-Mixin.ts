import Vue from 'vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import {changeCountryCodeToName, getCurrencyFromCountry} from '@/utils/Countries';
import ProductFeedSummaryStatus from '@/enums/product-feed/product-feed-summary-status';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';

export default Vue.extend({
  data() {
    return {
      ProductFeedSettingsPages,
    };
  },
  computed: {
    getProductFeedSettings() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_SETTINGS'];
    },
    isUS() {
      return (getDataFromLocalStorage('productFeed-targetCountries') || this.$store.getters['productFeed/GET_TARGET_COUNTRIES']).includes('US');
    },
    targetCountries(): string[] {
      return (getDataFromLocalStorage('productFeed-targetCountries') || this.$store.getters['productFeed/GET_TARGET_COUNTRIES']).map((country: string) => this.$t(
        'general.countryWithCurrencyFormat',
        {
          country: changeCountryCodeToName(country),
          currency: getCurrencyFromCountry(country),
        },
      ));
    },
    shippingSetupStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']
        ? ProductFeedSummaryStatus.WARNING
        : ProductFeedSummaryStatus.SUCCESS;
    },
    targetCountriesStatus() {
      return this.targetCountries.length
        ? ProductFeedSummaryStatus.SUCCESS
        : ProductFeedSummaryStatus.WARNING;
    },
    getAttributeMapping() {
      return this.$store.getters['productFeed/GET_ATTRIBUTE_MAPPING'];
    },
    attributeMappingStatus() {
      return this.getAttributeMapping
        ? ProductFeedSummaryStatus.SUCCESS
        : ProductFeedSummaryStatus.WARNING;
    },
    taxSettingsStatus() {
      // TODO BATCH 2
      // TODO retrieve tax settings from backend
      return ProductFeedSummaryStatus.SUCCESS;
    },
    productSelectionStatus() {
      // TODO if we can we need to check if filters are valid or not
      return ProductFeedSummaryStatus.SUCCESS;
    },
  },
});
