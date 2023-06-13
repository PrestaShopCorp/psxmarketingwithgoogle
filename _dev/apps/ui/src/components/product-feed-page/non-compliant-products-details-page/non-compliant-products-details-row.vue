<template>
  <b-tr
    class="align-items-center m-0 py-3"
  >
    <b-td>
      <b-link
        :href="getProductBaseUrl.replace('/1?', `/${verificationIssueProduct.id}?`)"
        target="_blank"
        class="external_link-no_icon font-weight-600"

      >
        {{ verificationIssueProduct.id }}
      </b-link>
      <div
        v-if="+verificationIssueProduct.variationCount"
      >
        {{ $tc('productFeedPage.compliancyIssueProductsPage.productVariants',
               +verificationIssueProduct.variationCount,
               {variantsCount: verificationIssueProduct.variationCount
               }) }}
      </div>
    </b-td>
    <b-td
      class="col-md-4"
    >
      {{ verificationIssueProduct.name }}
    </b-td>
    <b-td>
      <b-card
        v-for="langIso in verificationIssueProduct.langs"
        :key="langIso"
        border-variant="primary"
        class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13"
      >
        {{ langIso }}
      </b-card>
    </b-td>
    <b-td
      class="text-right"
    >
      <b-button
        variant="invisible"
        :href="getProductBaseUrl.replace('/1?', `/${verificationIssueProduct.id}?`)"
        target="_blank"
        class="external_link-no_icon"
      >
        <i class="material-icons ps_gs-fz-18">create</i>
      </b-button>
    </b-td>
  </b-tr>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';

import {ProductVerificationIssueProduct, ProductVerificationIssueTranslation} from '@/store/modules/product-feed/state';

export default defineComponent({
  name: 'NonCompliantProductsDetailsRow',
  props: {
    verificationIssueProduct: {
      type: Object as PropType<ProductVerificationIssueProduct>,
      required: true,
    },
  },
  data() {
    return {
      ProductVerificationIssueTranslation,
    };
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
  },
});
</script>
