<template>
  <div
    class="text-center py-3 ps_gs-fz-12"
  >
    <p class="mb-0 pt-2 text-muted">
      {{ $t('general.unableToFetchData') }}
    </p>
    <b-button
      variant="link"
      class="py-2 font-weight-normal ps_gs-fz-12 text-decoration-underline"
      @click="refresh"
    >
      {{ $t('general.refreshPage') }}
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'KeyMetricsErrorMessage',
  methods: {
    refresh() {
      this.$router.go();
    },
  },
};
</script>
