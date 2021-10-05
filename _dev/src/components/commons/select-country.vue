<template>
  <div>
    <ps-select
      v-model="country"
      :placeholder="$t('productFeedSettings.shipping.placeholderSelect')"
      :options="sortCountries"
      :deselect-from-dropdown="true"
      :clearable="false"
      class="ps_gs-v-select"
      label="country"
    >
      <template #option="{ country }">
        <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
          <span class="mr-2">
            {{ country }}
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
      v-if="needFilter"
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
      countryChosen: null,
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
    needFilter: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  methods: {
  },
  countriesSelectionOptions,
  googleUrl,
  computed: {
    country: {
      get() {
        return this.countryChosen || this.defaultCountry;
      },
      set(value) {
        this.countryChosen = value.country;
        this.$emit('countrySelected', [this.countryChosen]);
      },
    },
    sortCountries() {
      return this.needFilter
        ? countriesSelectionOptions.filter((el) => el.currency === this.currency)
        : countriesSelectionOptions;
    },
  },
};
</script>
