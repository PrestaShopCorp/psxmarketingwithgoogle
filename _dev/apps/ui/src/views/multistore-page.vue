<template>
  <div class="pt-2">
    <MultiStoreSelector
      :shops="shops"
      @shop-selected="onShopSelected($event)"
    />
  </div>
</template>

<script>
import MultiStoreSelector from '@/components/multistore/multi-store-selector.vue';

export default {
  name: 'MultistorePage',
  components: {
    MultiStoreSelector,
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
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
  },
};
</script>
