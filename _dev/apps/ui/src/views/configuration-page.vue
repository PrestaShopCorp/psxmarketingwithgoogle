<template>
  <div id="configuration">
    <multistore v-if="!psAccountsContext.isShopContext && shops.length" />
    <onboarding-page v-else />
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import Multistore from './multistore.vue';
import OnboardingPage from './onboarding-page.vue';

export default defineComponent({
  components: {
    OnboardingPage,
    Multistore,
  },

  props: {
  },
  computed: {
    psAccountsContext() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT'];
    },
    psAccountsIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
  },
});
</script>
