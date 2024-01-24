<template>
  <ps-modal
    id="MerchantCenterAccountPopinAccountIssues"
    ref="modal"
    :title="$t('productFeedPage.productIssuesModal.title')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="mb-3"
      :markdown="$t('productFeedPage.productIssuesModal.description')"
    />
    <collapsing-issues
      v-if="issues"
      :issues="issues"
    />

    <VueShowdown
      class="mt-3"
      :markdown="$t('productFeedPage.productIssuesModal.footer', [
        getProductBaseUrl.replace('/1?', `/${product?.idProduct}?`),
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
import {ProductIssue} from '@/components/render-issues/types';
import {RequestState} from '@/store/types';
import {ProductIdentifier} from './types';

export default defineComponent({
  name: 'PopinProductIssues',
  components: {
    PsModal,
    CollapsingIssues,
  },
  data() {
    return {
      issues: null as ProductIssue[]|null,
      loadingState: RequestState.IDLE as RequestState,
    };
  },
  props: {
    product: {
      type: Object as PropType<ProductIdentifier|null>,
      required: false,
      default: null,
    },
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
  },
  methods: {
    async loadProductIssues(): Promise<void> {
      this.loadingState = RequestState.PENDING;
      try {
        this.issues = await this.$store.dispatch('productFeed/REQUEST_REPORTING_PRODUCT_ISSUES', {
          product: this.product,
        });
        this.loadingState = RequestState.SUCCESS;
      } catch (error) {
        console.error(error);
        this.loadingState = RequestState.FAILED;
      }
    },
  },
  watch: {
    product: {
      handler(newValue) {
        this.issues = null;
        if (newValue) {
          this.loadProductIssues();
        }
      },
      immediate: true,
    },
  },
});
</script>
