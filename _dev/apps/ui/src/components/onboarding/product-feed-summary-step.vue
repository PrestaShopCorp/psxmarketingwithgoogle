<template>
  <div
    class="d-flex justify-content-between ps_gs-fz-13 product-feed-summary-step"
  >
    <div class="d-flex align-items-center product-feed-summary-step__title">
      <i
        v-if="status === ProductFeedSummaryStatus.SUCCESS"
        class="material-icons ps_gs-fz-20 mb-0 mr-1"
        :class="`text-${status}`"
      >
        check_circle
      </i>
      <i
        v-else
        class="material-icons material-icons-round ps_gs-fz-18 mb-0 mr-2"
        :class="`text-${status}`"
      >
        warning
      </i>
      <slot />
    </div>
    <b-link
      @click="goTo(linkTo)"
      class="text-right font-weight-600 product-feed-summary-step__link"
    >
      {{ $t('cta.edit') }}
    </b-link>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

import ProductFeedSummaryStatus from '@/enums/product-feed/product-feed-summary-status';
import {StepLink} from '@/components/onboarding/types';

export default defineComponent({
  name: 'ProductFeedSummaryStep',
  props: {
    status: {
      type: String,
      validator(value: string): value is ProductFeedSummaryStatus {
        return Object.values(ProductFeedSummaryStatus).includes(value as ProductFeedSummaryStatus);
      },
      required: false,
      default: ProductFeedSummaryStatus.SUCCESS,
    },
    linkTo: {
      type: Object as PropType<StepLink>,
      required: false,
      default: () => null,
    },
  },
  data() {
    return {
      ProductFeedSummaryStatus,
    };
  },
  methods: {
    goTo(link: StepLink) {
      this.$router.push({
        name: link.name,
        params: {
          step: link.params,
        },
      });
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', link.step);
    },
  },
});
</script>
