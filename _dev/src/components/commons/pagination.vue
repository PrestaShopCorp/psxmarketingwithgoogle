<template>
  <nav
    aria-label="Table pagination"
    class="ps_gs-table-controls__pagination mx-md-auto"
  >
    <ul
      class="pagination mb-0"
      role="menubar"
      aria-label="Pagination"
    >
      <li class="page-item previous">
        <b-button
          variant="invisible"
          class="page-link"
          :aria-label="$t('cta.previous')"
          @click="goToPage(activePage-1)"
        >
          <span class="sr-only">{{ $t('cta.previous') }}</span>
        </b-button>
      </li>
      <span
        v-for="(page,index) in totalPages"
        :key="index"
      >
        <li
          class="page-item"
          :class="{'active': isActive(index)}"
        >
          <b-button
            @click="goToPage(page)"
            variant="invisible"
            class="page-link"
            :aria-label="$tc('cta.goToPage', 0)"
          >
            {{ page }}
          </b-button>
        </li>
      <!-- <li class="page-item disabled">
        <b-button
          disabled
          variant="invisible"
          class="page-link"
        >
          ...
        </b-button>
      </li> -->
      </span>

      <li class="page-item next">
        <b-button
          variant="invisible"
          class="page-link"
          :aria-label="$t('cta.next')"
          @click="goToPage(activePage+1)"
        >
          <span class="sr-only">{{ $t('cta.next') }}</span>
        </b-button>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: 'Pagination',
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
  },
  methods: {
    isActive(index) {
      console.log('index', index);
      console.log('activePage', this.activePage);
      return index + 1 === this.activePage;
    },
    goToPage(page) {
      console.log(page);
      if (page > 0 && page <= this.totalPages) {
        this.$root.$emit('changePage', page);
      }
    },
  },
};
</script>
