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
    <template
      v-if="valuesOnError.length"
      #selected-option-container="{ option, deselect }"
    >
      <span
        :key="option.value"
        class="vs__selected"
        :class="{ 'vs__selected--error': valueIsOnError(option) }"
      >
        {{ option.value ?? option.name }}
        <button
          ref="deselectButtons"
          type="button"
          class="vs__deselect"
          :title="`Deselect ${ option.value ?? option.name }`"
          :aria-label="`Deselect ${ option.value ?? option.name }`"
          @click="deselect(option)"
        >
          <Deselect />
        </button>
      </span>
    </template>
  </ps-select>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import PsSelect from '@/components/commons/ps-select.vue';
import Deselect from '@/components/commons/ps-select-deselect.vue';

export default defineComponent({
  name: 'MultiSelectValue',
  components: {
    PsSelect,
    Deselect,
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
    valuesOnError: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    valueIsOnError() {
      return function (value: any): boolean {
        const valueIndex = this.$props.defaultValue.findIndex((el) => el.id === value.id);

        if (valueIndex !== -1) {
          return this.$props.valuesOnError.find((el) => el === valueIndex) !== undefined;
        }
        return false;
      };
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
