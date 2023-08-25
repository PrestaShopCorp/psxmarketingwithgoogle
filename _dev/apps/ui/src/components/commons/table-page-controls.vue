<template>
  <div
    class="
      ps_gs-table-controls
      d-flex
      flex-wrap flex-md-nowrap
      align-items-center
      bg-white
      pt-2
      px-3
      pb-3
      pt-md-3
    "
  >
    <ResultNumberSelector
      :selected-filter-quantity-to-show="selectedFilterQuantityToShow"
    />

    <nav
      aria-label="Table pagination"
      class="ps_gs-table-controls__pagination mx-md-auto"
    >
      <b-pagination
        @change="goToPage"
        :value="activePage"
        :total-rows="totalPages"
        :per-page="1"
        first-number
        last-number
        class="mb-0"
      />
    </nav>
    <PageNumberSelector v-if="needPageSelector" />
  </div>
</template>

<script>
import PageNumberSelector from './page-number-selector.vue';
import ResultNumberSelector from './result-number-selector.vue';

export default {
  name: 'TableControls',
  components: {
    PageNumberSelector,
    ResultNumberSelector,
  },
  props: {
    totalPages: {
      type: Number,
      required: true,
      default: 1,
    },
    activePage: {
      type: Number,
      required: true,
      default: 1,
    },
    selectedFilterQuantityToShow: {
      type: Number,
      required: true,
      default: 10,
    },
    needPageSelector: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.$root.$emit('changePage', page);
      }
    },
  },
};
</script>
