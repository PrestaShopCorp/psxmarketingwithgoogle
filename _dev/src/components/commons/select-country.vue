<template>
  <div>
    <ps-select
      data-test-id="ps-select-country"
      :deselect-from-dropdown="true"
      :multiple="true"
      :options="dropdownOptions"
      @search="onSearchCountry"
      label="name"
      v-model="countries"
      :placeholder=" $t('productFeedSettings.shipping.placeholderSelect')"
      :class="{'maxw-sm-500': notFullWidth }"
    >
      <template v-slot:option="option">
        <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
          <span
            class="mr-2"
            v-html="highlightSearch(option.name)"
          />
        </div>
      </template>
    </ps-select>
    <VueShowdown
      v-if="displayLegend"
      class="text-muted my-1 ps_gs-fz-12"
      :markdown="$t('productFeedSettings.shipping.cantFindCountry', [
        $options.googleUrl.supportedCountries
      ])"
      :extensions="['extended-link']"
    />
    <VueShowdown
      v-if="needFilter && displayLegend"
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
    defaultValue: {
      type: [String, Array],
      required: true,
      default() {
        return [];
      },
    },
    dropdownOptions: {
      type: Array,
      required: true,
    },
    needFilter: {
      type: Boolean,
      required: false,
      default: false,
    },
    displayLegend: {
      type: Boolean,
      required: false,
      default: true,
    },
    notFullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
    multipleCountries: {
      type: Boolean,
      required: false,
      default: false,
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
    getCountriesFilteredWithList(arg) {
      return this.dropdownOptions.filter((c) => arg.includes(c));
    },
  },
  countriesSelectionOptions,
  googleUrl,
  computed: {
    countries: {
      get() {
        return this.countriesChosen.length ? this.countriesChosen
          : this.getCountriesFilteredWithList(this.defaultValue);
      },
      set(value) {
        if (this.multipleCountries) {
          this.countriesChosen = value;
          this.$emit('countrySelected', value);
        } else {
          const country = value.length ? [value.pop()] : [];
          this.countriesChosen = country;
          this.$emit('countrySelected', country);
        }
      },
    },
  },
};
</script>
