<template>
  <div class="row bg-ocean-blue-500 px-5 py-4 mx-auto w-100">
    <div class="col-md-4">
      <img
        src="@/assets/images/included-in-subscription.svg"
      >
    </div>
    <div class="col-md-8">
      <p class="h2 font-family-prestafont text-primary">
        {{ $t('monetization.bannerInfoTitle') }}
      </p>
      <div
        v-for="(item, index) in advantages"
        :key="index"
        class="d-flex align-items-center mt-1"
      >
        <i class="material-icons-round ps_gs-fz-24 mr-1">check_circle</i>
        <span class="font-weight-600">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'MonetizationBannerInformation',
  data() {
    return {
      advantages: [
        this.$t('monetization.bannerInfoAdvantage1'),
        this.$t('monetization.bannerInfoAdvantage2'),
        this.$t('monetization.bannerInfoAdvantage3'),
      ],
    };
  },
});
</script>
