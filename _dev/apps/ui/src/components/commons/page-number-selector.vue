<template>
  <div class="ps_gs-table-controls__go-to d-flex align-items-center">
    <span class="flex-shrink-0">{{ $t('productFeedPage.approvalTable.goToLabel') }}</span>
    <b-form @submit.prevent="goToPage">
      <b-form-input
        class="ml-2 maxw-sm-72 flex-grow-0"
        type="text"
        size="sm"
        pattern="[0-9]*"
        v-model.number="nbPageToGo"
      />
    </b-form>
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

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'PageNumberSelector',
  data() {
    return {
      nbPageToGo: null as number|null,
    };
  },
  methods: {
    goToPage() {
      this.$emit('changePage', this.nbPageToGo);
    },
  },
});
</script>
