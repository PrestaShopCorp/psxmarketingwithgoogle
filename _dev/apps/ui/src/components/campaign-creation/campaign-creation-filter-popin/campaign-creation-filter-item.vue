<template>
  <li
    class="ps_gs-filters__item"
  >
    <template
      v-if="isFolder && item.visible"
    >
      <b-button
        variant="invisible"
        class="px-0 py-0 border-0 ps_gs-filters__item-button"
        @click="toggle"
      >
        <template v-if="isOpen">
          <i class="material-icons">keyboard_arrow_down</i>
        </template>
        <template v-else>
          <i class="material-icons">navigate_next</i>
        </template>
      </b-button>
    </template>
    <b-form-checkbox
      class="ps_gs-checkbox ps_gs-filters__item-checkbox"
      :name="`${item.name}Checkbox`"
      inline
      :checked="item.checked"
      @change="selectCheckbox"
      :indeterminate="item.indeterminate"
      v-if="item.visible"
    >
      <div class="d-flex w-100 justify-content-between pr-3">
        <span>
          {{ idAndName(item) }}
        </span>
        <span
          class="text-secondary"
          v-if="this.$store.state.campaigns.dimensionChosen.id !== 'products'"
        >
          {{ $tc(
            'smartShoppingCampaignCreation.xProducts',
            item.numberOfProductsAssociated,
            [item.numberOfProductsAssociated]
          ) }}
        </span>
      </div>
    </b-form-checkbox>
    <ul
      v-show="isOpen"
      v-if="isFolder && item.visible"
      class="ps_gs-filters__item-children"
    >
      <CampaignCreationFilterItem
        :is-open-by-default="isOpenByDefault"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'CampaignCreationFilterItem',
  data() {
    return {
      isOpen: this.isOpenByDefault || false,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => null,
      required: false,
    },
    isOpenByDefault: {
      type: Boolean,
      default: false,
      required: false,
    },
    checked: {
      type: Boolean,
      required: false,
      default: false,
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
      if (this.$store.state.campaigns.dimensionChosen.id === 'conditions') {
        return this.$t(`smartShoppingCampaignCreation.productConditions.${item.name}`);
      }
      return item.id !== item.name ? `${item.id} - ${item.name}` : item.name;
    },
  },
};
</script>
