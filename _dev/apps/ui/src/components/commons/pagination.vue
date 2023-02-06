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
        >
          <span class="sr-only">{{ $t('cta.previous') }}</span>
        </b-button>
      </li>
      <li class="page-item">
        <b-button
          variant="invisible"
          class="page-link"
          :aria-label="$tc('cta.goToPage', 0)"
        >
          1
        </b-button>
      </li>
      <li class="page-item disabled">
        <b-button
          disabled
          variant="invisible"
          class="page-link"
        >
          ...
        </b-button>
      </li>
      <li class="page-item">
        <b-button
          variant="invisible"
          class="page-link"
        >
          5
        </b-button>
      </li>
      <li class="page-item">
        <b-button
          variant="invisible"
          class="page-link"
        >
          6
        </b-button>
      </li>
      <li
        class="page-item active"
        aria-current="page"
      >
        <b-button
          variant="invisible"
          class="page-link"
        >
          7
        </b-button>
      </li>
      <li class="page-item">
        <b-button
          variant="invisible"
          class="page-link"
        >
          8
        </b-button>
      </li>
      <li class="page-item">
        <b-button
          variant="invisible"
          class="page-link"
        >
          9
        </b-button>
      </li>
      <li class="page-item disabled">
        <b-button
          disabled
          variant="invisible"
          class="page-link"
        >
          ...
        </b-button>
      </li>
      <li class="page-item">
        <b-button
          variant="invisible"
          class="page-link"
          :aria-label="$tc('cta.goToPage', 2)"
        >
          16
        </b-button>
      </li>
      <li class="page-item next">
        <b-button
          variant="invisible"
          class="page-link"
          :aria-label="$t('cta.next')"
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
  // TODO Dev the pagination 🤷
};
</script>
