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
        :class="[!selectedFilters ? 'ps_gs-filters__item-button' : 'ps_gs-filters__item-button--with-label']"
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
        @click="deselectFilter(item)"
      >
        <i class="material-icons">close</i>
        <span class="sr-only">
          Remove filter(s)
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
    item: Object,
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
      };
    },
    // TODO: handle checkboxes
    // ! Checkboxes are not handled at all
    deselectFilter(item) {
      // TODO: fn to deselect an item
    },
    countChildren(item) {
      // TODO: check if function is OK to count items
      let tableOfCHildren = []

      function fillTableOfChildren(item) {
        if (!item.children) {
          tableOfCHildren.push(item.name);
          return item.name
        };

        item.children.forEach(child => fillTableOfChildren(child));
      };

      fillTableOfChildren(item);
      return tableOfCHildren.length;
    },
  },
};
</script>
