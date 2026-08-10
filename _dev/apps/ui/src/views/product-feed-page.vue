<template>
  <main class="pt-3 tiny-lux-product-feed-page">
    <header class="mb-4">
      <h1 class="h2 mb-2">
        {{ $t('tinyLuxGoogle.syncTitle') }}
      </h1>
      <p class="text-muted mb-0">
        {{ $t('tinyLuxGoogle.syncIntro') }}
      </p>
    </header>
    <ProductFeedCard
      :is-enabled="merchantCenterIsSelected"
      :loading="false"
    />
  </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProductFeedCard from '@/components/onboarding/product-feed-card.vue';

export default defineComponent({
  name: 'ProductFeedPage',
  components: {ProductFeedCard},
  computed: {
    merchantCenterIsSelected(): boolean {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
  },
});
</script>
