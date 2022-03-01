<template>
  <div class="ps_gs-table-controls__go-to d-flex align-items-center">
    <span class="flex-shrink-0">{{ $t('productFeedPage.approvalTable.goToLabel') }}</span>
    <b-form-input
      class="ml-2 maxw-sm-72 flex-grow-0"
      type="text"
      size="sm"
      pattern="[0-9]*"
      v-model.number="nbPageToGo"
    />
    <b-button
      variant="primary"
      class="ml-2"
      size="sm"
      @click="goToPage"
    >
      {{ $t('cta.go') }}
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'PageNumberSelector',
  data() {
    return {
      nbPageToGo: null,
    };
  },
  methods: {
    goToPage() {
      this.$root.$emit('changePage', this.nbPageToGo);
    },
  },
};
</script>
