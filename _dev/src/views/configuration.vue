<template>
  <div id="configuration">
    <landing-page />
    <onboarding-page />
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';
import LandingPage from './landing-page.vue';
import OnboardingPage from './onboarding-page.vue';

export default defineComponent({
  name: 'configuration',
  components: {
    LandingPage, OnboardingPage,
  },
  props: {
  },
  data() {
    return {
      psAccountsIsOnboarded: false,
    };
  },
  created() {
  },
  methods: {
  },
  computed: {
  },
});
</script>

<style lang="scss">
</style>
