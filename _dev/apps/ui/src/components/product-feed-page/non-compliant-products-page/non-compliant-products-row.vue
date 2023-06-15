<template>
  <b-tr
    class="align-items-center m-0 py-3"
  >
    <b-td>
      {{ $t(`productFeedPage.compliancyIssues.${
        ProductVerificationIssueTranslation[verificationIssue.name
        ]}`) }}
    </b-td>
    <b-td
      class="col-md-4 ps_gs_noncompliant_cell"
    >
      <VueShowdown
        :markdown="$t(`productFeedPage.compliancyIssues.${
          ProductVerificationIssueTranslation[verificationIssue.name
        ]}Action`)"
      />
    </b-td>
    <b-td>
      {{ numberOfAffectedProducts }}
      <b-link
        :to="{
          name: 'product-feed-verification-error-products',
          params: {error: verificationIssue.name},
        }"
        class="text-nowrap"
      >
        {{ $tc(
          'productFeedPage.compliancyIssuesPage.actions.listProducts',
          numberOfAffectedProducts,
        ) }}
      </b-link>
    </b-td>
    <b-td>
      <b-card
        v-for="(numberOfProducts, langIso) in verificationIssue.affected"
        :key="langIso"
        border-variant="primary"
        class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13"
      >
        {{ langIso }}
      </b-card>
    </b-td>
  </b-tr>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';

import {ProductVerificationIssueOverall, ProductVerificationIssueTranslation} from '@/store/modules/product-feed/state';

export default defineComponent({
  name: 'NonCompliantProductsRow',
  props: {
    verificationIssue: {
      type: Object as PropType<ProductVerificationIssueOverall>,
      required: true,
    },
  },
  data() {
    return {
      ProductVerificationIssueTranslation,
    };
  },
  computed: {
    numberOfAffectedProducts(): number {
      return Object.values(this.verificationIssue.affected).reduce((prev, curr) => prev + curr, 0);
    },
  },
});
</script>
