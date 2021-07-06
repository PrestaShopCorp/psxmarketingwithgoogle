<template>
  <div class="pt-2">
    <template v-if="!psAccountsContext.isShopContext && shops.length">
      <b-alert
        v-if="!psAccountsContext.isShopContext && shops.length"
        show
        variant="warning"
        class="mb-0 mt-3 mb-3"
      >
        {{ $t('onboarding.warningMultistore') }}
      </b-alert>
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
import {MultiStoreSelector} from 'prestashop_accounts_vue_components';
import LandingPage from './landing-page.vue';

export default {
  name: 'OnboardingPage',
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
