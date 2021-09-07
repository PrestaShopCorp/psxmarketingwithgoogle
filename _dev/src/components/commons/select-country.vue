<template>
  <div>
    <ps-select
      v-model="country"
      :placeholder="$t('productFeedSettings.shipping.placeholderSelect')"
      :options="sortCountries"
      :deselect-from-dropdown="true"
      :clearable="false"
      class="ps_gs-v-select maxw-sm-500"
      label="country"
      :selected="getCountry"
    >
      <template #option="{ country }">
        <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
          <span class="mr-2">
            {{ country }}
          </span>
          <span
            v-if="!isCompatibleWithCurrency(country)"
            class="ps_gs-fz-12 ml-auto"
          >
            {{ $t('productFeedSettings.steps.shippingSettingsErrors') }}
          </span>
        </div>
      </template>
    </ps-select>
    <VueShowdown
      class="text-muted my-1 ps_gs-fz-12"
      :markdown="$t('productFeedSettings.shipping.cantFindCountry', [
        $options.googleUrl.supportedCountries
      ])"
      :extensions="['extended-link']"
    />
    <VueShowdown
      class="text-muted my-1 ps_gs-fz-12"
      :markdown="$t('productFeedSettings.shipping.cantSelectCountryWithDifferentCurrency')"
    />
  </div>
</template>

<script>
import PsSelect from '../commons/ps-select';
import countriesSelectionOptions from '../../assets/json/countries.json';
import googleUrl from '../../assets/json/googleUrl.json';

export default {
  name: 'SelectCountryWithCurrency',
  components: {
    PsSelect,
  },
  data() {
    return {
      country: this.defaultCountry,
    };
  },
  props: {
    currency: {
      type: String,
      required: true,
    },
    defaultCountry: {
      required: true,
    },
  },
  methods: {
    isCompatibleWithCurrency(country) {
      const currentCountry = countriesSelectionOptions.find((el) => el.country === country);
      return currentCountry.currency === this.currency;
    },
    getCountry() {
      this.$emit('countrySelected', this.country);
    },
  },
  countriesSelectionOptions,
  googleUrl,
  computed: {
    sortCountries() {
      return countriesSelectionOptions.filter((el) => el.currency === this.currency);
    },
  },
};
</script>
