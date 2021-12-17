<template>
  <div>
    <ps-select
      :deselect-from-dropdown="true"
      :multiple="isMultiple"
      :options="filterCountries.filter(c => countries.indexOf(c) < 0)"
      @search="onSearchCountry"
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
      countriesChosen: [],
      searchString: '',
    };
  },
  props: {
    currency: {
      type: String,
      required: true,
    },
    defaultCountries: {
      type: Array,
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
    onSearchCountry(event) {
      this.searchString = event;
    },
    highlightSearch(str) {
      /** Highlight search terms */
      const regex = new RegExp(`(${this.searchString})`, 'gi');
      return str.replace(regex, '<strong>$1</strong>');
    },
    verifyDefaultCountriesExist(countries) {
      if (!this.filterCountries.length) {
        return [];
      }
      const exist = countriesSelectionOptions.filter((c) => countries.includes(c.country));
      return exist ? countries : [];
    },
  },
  countriesSelectionOptions,
  googleUrl,
  computed: {
    countries: {
      get() {
        return this.countriesChosen.length ? this.countriesChosen
          : this.verifyDefaultCountriesExist(this.defaultCountries);
      },
      set(value) {
        this.countriesChosen = value;
        this.$emit('countrySelected', value);
      },
    },
    filterCountries() {
      // 'this' is not retrieved inside reduce so we create a new variable
      const {currency} = this;
      if (!this.needFilter) {
        return countriesSelectionOptions.map((e) => e.country);
      }
      return countriesSelectionOptions.reduce((ids, obj) => {
        if (obj.currency === currency) {
          ids.push(obj.country);
        }
        return ids;
      }, []);
    },
  },
};
</script>
