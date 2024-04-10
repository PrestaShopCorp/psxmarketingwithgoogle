<template>
  <div
    class="py-3 text-center ps_gs-fz-12"
  >
    <p class="pt-2 mb-0 text-primary-600">
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
