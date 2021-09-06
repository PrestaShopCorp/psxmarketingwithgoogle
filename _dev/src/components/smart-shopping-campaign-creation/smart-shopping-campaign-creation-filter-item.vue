<template>
  <li
    class="ps_gs-categories-list__item"
  >
    <b-button
      variant="invisible"
      class="ps_gs-categories-list__item-button"
      v-if="isFolder"
      @click="toggle"
    >
      <template v-if="isOpen">
        <i class="material-icons">keyboard_arrow_down</i>
      </template>
      <template v-else>
        <i class="material-icons">navigate_next</i>
      </template>
    </b-button>
    <b-form-checkbox
      class="ps_gs-checkbox ps_gs-categories-list__item-checkbox"
      :name="`${item.name}Checkbox`"
      inline
    >
      {{ item.name }}
    </b-form-checkbox>
    <ul
      v-show="isOpen"
      v-if="isFolder"
      class="ps_gs-categories-list__item-children"
    >
      <SmartShoppingCampaignCreationFilterItem
        class="item"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
      />
    </ul>
  </li>
</template>

<script>

export default {
  name: 'SmartShoppingCampaignCreationFilterItem',
  data() {
    return {
      isOpen: false,
    };
  },
  props: {
    item: Object,
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
  },
};
</script>
