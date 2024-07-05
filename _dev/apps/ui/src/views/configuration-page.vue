<template>
  <div id="configuration">
    <multistore-page v-if="!psAccountsContext.isShopContext && shops.length" />
    <onboarding-page v-else />

    <!-- Modal Monetization Module -->
    <PreMonetizationPopin ref="PreMonetizationPopin" />
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import MultistorePage from './multistore-page.vue';
import OnboardingPage from './onboarding-page.vue';
import PreMonetizationPopin from '../components/monetization/pre-monetization-popin';

export default defineComponent({
  components: {
    OnboardingPage,
    MultistorePage,
    PreMonetizationPopin,
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
