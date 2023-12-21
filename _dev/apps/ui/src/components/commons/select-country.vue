<template>
  <ps-select
    data-test-id="ps-select-country"
    :deselect-from-dropdown="true"
    :multiple="true"
    :options="dropdownOptions"
    @search="onSearchCountry"
    label="name"
    v-model="countries"
    :placeholder=" $t('productFeedSettings.deliveryTimeAndRates.placeholderSelect')"
    :class="{'maxw-sm-500': notFullWidth }"
  >
    <template #option="option">
      <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
        <span
          class="mr-2"
          v-html="highlightSearch(option.name)"
        />
      </div>
    </template>
  </ps-select>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import PsSelect from '@/components/commons/ps-select.vue';
import countriesSelectionOptions from '@/assets/json/countries.json';
import googleUrl from '@/assets/json/googleUrl.json';

export default defineComponent({
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
      set(newValuesList) {
        if (this.multipleCountries) {
          this.countriesChosen = newValuesList;
          this.$emit('countrySelected', newValuesList);
        } else {
          const listOfOneCountry = newValuesList.length ? [newValuesList.pop()] : [];
          this.countriesChosen = listOfOneCountry;
          this.$emit('countrySelected', listOfOneCountry);
        }
      },
    },
  },
});
</script>
