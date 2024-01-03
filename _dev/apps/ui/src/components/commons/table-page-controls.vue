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
      @changeLimit="$emit('changeLimit', $event)"
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
    <PageNumberSelector
      v-if="needPageSelector"
      @changePage="goToPage($event)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import PageNumberSelector from './page-number-selector.vue';
import ResultNumberSelector from './result-number-selector.vue';

export default defineComponent({
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
    goToPage(page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('changePage', page);
      }
    },
  },
});
</script>
