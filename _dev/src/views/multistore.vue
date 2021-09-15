<template>
  <div class="pt-2">
    <template v-if="!psAccountsContext.isShopContext && shops.length">
      <MultiStoreSelector
        v-if="!psAccountsContext.isShopContext && shops.length"
        :shops="shops"
        @shop-selected="onShopSelected($event)"
      />
    </template>
    <landing-page v-else />
  </div>
</template>

<script>
import MultiStoreSelector from '@/components/multistore/multi-store-selector.vue';
import LandingPage from './landing-page.vue';

export default {
  name: 'MultiStoreSelector',
  components: {
    MultiStoreSelector,
    LandingPage,
  },
  data() {
    return {
      isMcaLinking: false,
    };
  },
  methods: {
    onShopSelected(shopSelected) {
      window.location.href = shopSelected.url;
    },
  },
  computed: {

    psAccountsContext() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT'];
    },
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
  },
};
</script>
