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
      <div class="d-flex w-100 justify-content-between pr-3">
        <span>
          {{ idAndName(item) }}
        </span>
        <span
          class="text-secondary"
          v-if="this.$store.state.smartShoppingCampaigns.dimensionChosen.id !== 'products'"
        >
          {{ $tc(
            'smartShoppingCampaignCreation.xProducts',
            item.numberOfProductsAssociated,
            [item.numberOfProductsAssociated]
          ) }}
        </span>
      </div>
    </b-form-checkbox>
    <div v-else>
      <template v-if="!isFolder">
        {{ item.id }} - {{ item.name }} - {{ item.numberOfProductsAssociated }}
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
    </div>
    <ul
      v-show="isOpen"
      v-if="isFolder"
      class="ps_gs-filters__item-children"
    >
      <SmartShoppingCampaignCreationFilterItem
        :is-open-by-default="isOpenByDefault"
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
        item: this.item,
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
    idAndName(item) {
      if (this.$store.state.smartShoppingCampaigns.dimensionChosen.id === 'conditions') {
        return this.$t(`smartShoppingCampaignCreation.productConditions.${item.name}`);
      }
      return item.id !== item.name ? `${item.id} - ${item.name}` : item.name;
    },
  },
};
</script>
