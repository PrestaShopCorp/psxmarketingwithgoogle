<template>
  <ps-modal
    id="MerchantCenterAccountPopinAccountIssues"
    ref="modal"
    :title="$t('productFeedPage.productIssues.title')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="mb-3"
      :markdown="$t('productFeedPage.productIssues.description')"
    />
    <collapsing-issues
      :issues="issues"
    />

    <VueShowdown
      class="mt-3"
      :markdown="$t('productFeedPage.productIssues.footer', [
        getProductBaseUrl.replace('/1?', `/${productId}?`),
      ])"
    />
    
    <template slot="modal-footer">
      <span />
    </template>
  </ps-modal>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import PsModal from '@/components/commons/ps-modal.vue';
import CollapsingIssues from '@/components/render-issues/collapsing-issues.vue';
import {ProductIssue} from '@/components/render-issues/product-issues.types';

export default defineComponent({
  name: 'PopinProductIssues',
  components: {
    PsModal,
    CollapsingIssues,
  },
  props: {
    issues: {
      type: Array as PropType<ProductIssue[]>,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
  },
});
</script>
