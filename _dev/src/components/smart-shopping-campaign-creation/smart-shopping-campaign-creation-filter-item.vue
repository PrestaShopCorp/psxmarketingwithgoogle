<template>
  <li
    class="ps_gs-filters__item"
  >
    <template
      v-if="isFolder"
    >
      <b-button
        variant="invisible"
        class="px-0 py-0 border-0"
        :class="[!selectedFilters
          ? 'ps_gs-filters__item-button'
          : 'ps_gs-filters__item-button--with-label']"
        @click="toggle"
      >
        <template v-if="isOpen">
          <i class="material-icons">keyboard_arrow_down</i>
        </template>
        <template v-else>
          <i class="material-icons">navigate_next</i>
        </template>
        <span
          v-if="selectedFilters"
          class="font-weight-normal"
        >
          {{ item.name }} ({{ countChildren(item) }})
        </span>
      </b-button>
    </template>
    <b-form-checkbox
      v-if="!selectedFilters"
      class="ps_gs-checkbox ps_gs-filters__item-checkbox"
      :name="`${item.name}Checkbox`"
      inline
      :checked="item.checked"
      @change="selectCheckbox"
      :indeterminate="item.indeterminate"
    >
      {{ item.name }}
    </b-form-checkbox>
    <template v-else>
      <template v-if="!isFolder">
        {{ item.name }}
      </template>
      <b-button
        variant="invisible"
        class="px-1 py-0 border-0 ps_gs-fz-10"
        @click="deselectFilter()"
      >
        <i class="material-icons">close</i>
        <span class="sr-only">
          {{ $tc('cta.removeFilter', !!item.children ? item.children.length : 1) }}
        </span>
      </b-button>
    </template>
    <ul
      v-show="isOpen"
      v-if="isFolder"
      class="ps_gs-filters__item-children"
    >
      <SmartShoppingCampaignCreationFilterItem
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :selected-filters="selectedFilters"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'SmartShoppingCampaignCreationFilterItem',
  data() {
    return {
      isOpen: this.isOpenByDefault || false,
    };
  },
  props: {
    item: [Array, Object],
    isOpenByDefault: {
      type: Boolean,
      default: false,
      required: false,
    },
    selectedFilters: {
      type: Boolean,
      default: false,
      required: false,
    },
    checked: {
      type: Boolean,
      required: false,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isFolder() {
      return this.item.children && this.item.children.length;
    },
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    deselectFilter() {
      this.$root.$emit('filterSelected', {
        id: this.item,
        checked: false,
      });
    },
    selectCheckbox(event) {
      this.$root.$emit('filterSelected', {
        item: this.item,
        checked: event,
      });
    },
    countChildren(item) {
      // TODO: check if function is OK to count items
      const tableOfCHildren = [];

      // eslint-disable-next-line
      function fillTableOfChildren(elem) {
        if (!elem.children) {
          tableOfCHildren.push(elem.name);
          return elem.name;
        }
        elem.children.forEach((child) => fillTableOfChildren(child));
      }

      fillTableOfChildren(item);
      return tableOfCHildren.length;
    },
  },
};
</script>
