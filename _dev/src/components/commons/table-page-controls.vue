<template>
  <div
    class="ps_gs-table-controls d-flex flex-wrap flex-md-nowrap
    align-items-center bg-white pt-2 px-3 pb-3 pt-md-3"
  >
    <ResultNumberSelector />
    <Pagination />
    <PageNbSelector />
  </div>
</template>

<script>
import Pagination from './pagination.vue';
import PageNbSelector from './page-number-selector.vue';
import ResultNumberSelector from './result-number-selector.vue';

export default {
  name: 'TableControls',
  components: {
    Pagination,
    PageNbSelector,
    ResultNumberSelector,
  },
  data() {
    return {
    };
  },
};
</script>
