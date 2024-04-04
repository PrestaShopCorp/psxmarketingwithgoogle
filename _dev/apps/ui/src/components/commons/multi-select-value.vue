<template>
  <ps-select
    data-test-id="ps-select-value"
    :deselect-from-dropdown="true"
    :multiple="true"
    :options="dropdownOptions"
    @search="onSearchValue"
    label="name"
    v-model="selectedItems"
    :placeholder=" $t('productFeedSettings.deliveryTimeAndRates.placeholderSelect')"
    :class="{'maxw-sm-500': notFullWidth }"
  >
    <template #option="option">
      <b-form-checkbox
        data-test-id="buttonCheckbox"
        class="ps_gs-checkbox"
      />
      <span
        class="mr-2"
        v-html="highlightSearch(option.name)"
      />
    </template>
  </ps-select>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import PsSelect from '@/components/commons/ps-select.vue';

export default defineComponent({
  name: 'MultiSelectValue',
  components: {
    PsSelect,
  },
  data() {
    return {
      searchString: '',
      selectedItems: [],
      isChecked: false,
    };
  },
  props: {
    dropdownOptions: {
      type: Array,
      required: true
    },
    notFullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    onSearchValue(event) {
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
  mounted() {
    this.dropdownOptions = ["Black", "White", "Red", "Blue", "Green", "Yellow"];
  },
});
</script>
