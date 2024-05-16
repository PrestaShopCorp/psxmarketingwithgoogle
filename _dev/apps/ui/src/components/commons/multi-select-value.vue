<template>
  <ps-select
    data-test-id="ps-select-value"
    :deselect-from-dropdown="true"
    :multiple="true"
    :options="dropdownOptions"
    @search="onSearchValue"
    label="value"
    v-model="selectedItems"
    :placeholder="placeholder"
    :class="{'maxw-sm-500': notFullWidth, 'disabled': disabled }"
    @input="$emit('dataUpdated', selectedItems)"
  >
    <template #option="option">
      <b-form-checkbox
        data-test-id="buttonCheckbox"
        class="ps_gs-checkbox"
      />
      <span
        class="mr-2"
        v-html="highlightSearch(option.value ?? option.name)"
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
      selectedItems: this.$props.defaultValue ?? [],
      isChecked: false,
      inputSearch: HTMLElement,
      menuSelect: HTMLElement,
    };
  },
  props: {
    dropdownOptions: {
      type: Array,
      required: true,
    },
    notFullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    defaultValue: {
      type: Array,
      required: false,
      default: () => [],
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
  watch: {
    defaultValue(newValue) {
      this.selectedItems = newValue;
    },
  },
});
</script>
