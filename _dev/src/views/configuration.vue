<template>
  <div id="configuration">
    <multistore v-if="!psAccountsIsOnboarded && shops.length" />
    <landing-page v-else-if="!googleAccountIsOnboarded" />
    <onboarding-page v-else />
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
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
    this.$segment.track('[GGL] Start Visit', {
      module: 'psxmarketingwithgoogle',
      params: SegmentGenericParams,
    });
  },
  computed: {
    psAccountsIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
    googleAccountIsOnboarded() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_IS_ONBOARDED'];
    },
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
  },
});
</script>

<style lang="scss">
</style>
