<template>
  <div id="configuration">
    <multistore v-if="!psAccountsIsOnboarded && shops.length" />
    <landing-page v-else-if="!psAccountsIsOnboarded" />
    <onboarding-page v-else />
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';
import LandingPage from './landing-page.vue';
import Multistore from './multistore.vue';
import OnboardingPage from './onboarding-page.vue';

export default defineComponent({
  name: 'configuration',
  components: {
    LandingPage,
    OnboardingPage,
    Multistore,
  },
  props: {
  },
  created() {
    this.$root.$on('onHideLanding', () => {
      this.$router.push({
        name: 'onboarding',
      });
    });
  },
  computed: {
    psAccountsIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
  },
});
</script>
