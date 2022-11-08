<template>
  <section>
    <b-card
      no-body
      class="ps_gs-onboardingcard p-3"
    >
      <BannerAds
        size="xs"
        :is-banner="false"
      />
    </b-card>
  </section>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import BannerAds from '../commons/banner-ads.vue';

export default defineComponent({
  name: 'PromoCard',
  components: {
    BannerAds,
  },
});
</script>
  