<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <h2 class="ps_gs-fz-16 font-weight-600">
        {{ $t('productFeedPage.dashboardPage.productVerification.stepTitle') }}
      </h2>
      <b-button
        id="tooltip-verified-product"
        class="ml-1 p-0 d-flex"
        variant="text"
      >
        <span class="material-icons-round ps_gs-fz-20 mb-1 ml-0 text-secondary">
          info_outlined
        </span>
      </b-button>
      <b-tooltip
        target="tooltip-verified-product"
        triggers="hover"
        container="#psxMktgWithGoogleApp"
      >
        <VueShowdown
          :markdown="$t('productFeedPage.dashboardPage.productVerification.stepDetails')"
        />
      </b-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {VueShowdown} from 'vue-showdown';

export default defineComponent({
  components: {
    VueShowdown,
  },
});
</script>
