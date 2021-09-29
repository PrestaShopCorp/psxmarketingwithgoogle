<template>
  <div id="ad-blocker">
    <b-card
      no-body
      class="ps_gs-onboardingcard px-0"
    >
      <b-card-header
        header-tag="h3"
        header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
      >
        AD BLOCKER EXISTS. Please remove it to continue
      </b-card-header>
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
        variant="outline-secondary"
        @click="refresh"
        data-test-id="btn-refresh"
      >
        {{ $t('general.refreshPage') }}
      </b-button>
    </b-card>
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';

export default defineComponent({
  name: 'ad-blocker',
  components: {

  },
  props: {
  },
  methods: {
    refresh() {
      this.$router.push({
        name: 'configuration',
      });
    },
  },

});
</script>

<style lang="scss">
</style>
