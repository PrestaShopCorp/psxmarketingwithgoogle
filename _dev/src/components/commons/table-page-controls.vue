<template>
  <div
    class="ps_gs-table-controls d-flex flex-wrap flex-md-nowrap
    align-items-center bg-white pt-2 px-3 pb-3 pt-md-3"
  >
    <ResultNumberSelector :selected-filter-quantity-to-show="selectedFilterQuantityToShow" />
    <Pagination
      :total-pages="totalPages"
      :page-number="pageNumber"
    />
    <PageNumberSelector />
  </div>
</template>

<script>
import Pagination from './pagination.vue';
import PageNumberSelector from './page-number-selector.vue';
import ResultNumberSelector from './result-number-selector.vue';

export default {
  name: 'TableControls',
  components: {
    Pagination,
    PageNumberSelector,
    ResultNumberSelector,
  },
  props: {
    totalPages: {
      type: Number,
      required: true,
      default: 1,
    },
    pageNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    selectedFilterQuantityToShow: {
      type: Number,
      required: true,
      default: 10,
    },
  },
};
</script>
