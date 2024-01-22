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
      :issues="issues"
    />

    <VueShowdown
      class="mt-3"
      :markdown="$t('productFeedPage.productIssuesModal.footer', [
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
import {BTooltip} from 'bootstrap-vue';
import PsModal from '@/components/commons/ps-modal.vue';
import CollapsingIssues from '@/components/render-issues/collapsing-issues.vue';
import {ProductIssue} from '@/components/render-issues/product-issues.types';

export default defineComponent({
  name: 'PopinProductIssues',
  components: {
    PsModal,
    CollapsingIssues,
  },
  data() {
    return {
      tooltipsComponents: [] as BTooltip[],
    };
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
  methods: {
    findAndCreateTooltips(): void {
      // Initialisation of Tooltips
      const tooltips = this.$el.querySelectorAll('.tooltip');

      tooltips.forEach((tooltip) => {
        const tooltipText = tooltip.querySelector('.tooltip-text');
        const tooltipIcon = tooltip.querySelector('.tooltip-icon');

        const $tooltip = new BTooltip({
          parent: this,

          propsData: {
            target: tooltipIcon,
            container: '#psxMktgWithGoogleApp',
            title: tooltipText?.textContent,
          },
        });

        $tooltip.$mount();
        this.tooltipsComponents.push($tooltip);
      });
    },
    unloadTooltips(): void {
      this.tooltipsComponents.forEach((tooltip) => tooltip.$destroy());
    },
  },
  mounted() {
    // Because the HTML code comes from Google API, we have to bend it
    // to use specific features of our application.
    this.findAndCreateTooltips();
  },
});
</script>
