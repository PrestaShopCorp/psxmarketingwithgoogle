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
      <!-- <div v-for="(onePage, index) in pagesComputed" :key="index">
      <li class="page-item">
        <b-button
          variant="invisible"
          class="page-link"
          :aria-label="$tc('cta.goToPage', 0)"
        >
         {{onePage.page}}
        </b-button>
      </li>
      </div>
      <li class="page-item disabled">
        <b-button
          disabled
          variant="invisible"
          class="page-link"
        >
          ...
        </b-button>
      </li>-->
      <li
        class="page-item next"
        v-if="nextPage"
      >
        <b-button
          variant="invisible"
          class="page-link"
          :aria-label="$t('cta.next')"
          @click="fetchNewCampaigns"
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
    nextPage: {
      type: String,
      required: true,
      default: null,
    },
  },
  // data() {
  //   return {
  //     pages: 1
  //   }
  // },
  methods: {
    fetchNewCampaigns() {
      this.$emit('fetchNewCampaigns');
      // this.pages +=1
    },
  },
  // computed: {
  //   pagesComputed() {
  //     let finish = []
  //     for (let i=1; i<=this.pages; i++){
  //        finish.push({
  //         page: i
  //       })
  //     }
  //     return finish
  //   }
  // }
};
</script>
