<template>
  <div id="configuration">
    <multistore v-if="!psAccountIsOnboarded && shops.length" />
    <landing-page v-else-if="!psAccountIsOnboarded" />
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
  data() {
    return {
    };
  },
  created() {
    this.$root.$on('onHideLanding', () => {
      this.$router.push({
        name: 'onboarding',
      });
    });
  },
  methods: {
  },
  computed: {
    psAccountIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
  },
});
</script>

<style lang="scss">
</style>
