<template>
  <div>
    <ps-select
      :deselect-from-dropdown="true"
      :multiple="isMultiple"
      :options="sortCountries"
      @search="searchProducts"
      label="name"
      v-model="countries"
      :placeholder=" $t('productFeedSettings.shipping.placeholderSelect')"
      class="maxw-sm-500"
    >
      <template v-slot:option="option">
        <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
          <span
            class="mr-2"
            v-html="highlightSearch(`${option.name}`)"
          />
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
      countryChosen: [],
      searchString: '',
    };
  },
  props: {
    currency: {
      type: String,
      required: true,
    },
    defaultCountries: {
      required: true,
    },
    needFilter: {
      type: Boolean,
      required: false,
      default: true,
    },
    isMultiple: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  methods: {
    searchProducts(event) {
      this.searchString = event;
    },
    highlightSearch(str) {
      /** Highlight search terms */
      const regex = new RegExp(`(${this.searchString})`, 'gi');
      return str.replace(regex, '<strong>$1</strong>');
    },
  },
  countriesSelectionOptions,
  googleUrl,
  computed: {
    countries: {
      get() {
        return this.countryChosen.length ? this.countryChosen : this.defaultCountries;
      },
      set(value) {
        this.countryChosen = value;
        this.$emit('countrySelected', value);
      },
    },
    sortCountries() {
      // 'this' is not retrieved inside reduce so we create a new variable
      const {currency} = this;
      return this.needFilter
        ? countriesSelectionOptions.reduce((ids, obj) => {
          if (obj.currency === currency) {
            ids.push(obj.country);
          }
          return ids;
        }, [])
        : countriesSelectionOptions;
    },
  },
};
</script>
