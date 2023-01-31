<template>
  <div class="ps_gs-table-controls__products-shown d-md-flex align-items-center d-none">
    <span>{{ $t('productFeedPage.approvalTable.perPageLabel') }}</span>
    <b-dropdown
      id="filter-quantity-to-show"
      ref="filter-quantity-to-show"
      :text="selectedFilterQuantityToShow"
      variant=" "
      class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered w-auto ml-2"
      menu-class="ps-dropdown"
      size="sm"
    >
      <b-dropdown-item
        v-for="(option, index) in ['10', '20', '50']"
        :key="index"
        @click="onChangeLimit(option)"
      >
        {{ option }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'ResultNumberSelector',
  data() {
    return {
      selectedFilterQuantityToShow: '10',
    };
  },
  methods: {
    onChangeLimit(limitChosen) {
      this.selectedFilterQuantityToShow = limitChosen;
      this.$root.$emit('changeLimit', Number(limitChosen));
    },

  },
};
</script>
