<template>
  <div id="configuration">
    <landing-page
      v-if="!psAccountsIsOnboarded && showIntroduction"
    />
    <template v-else>
      <onboarding-page />
    </template>
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
      psAccountsIsOnboarded: this.$store.getters.psAccountsIsOnboarded,
      showIntroduction: true,
    };
  },
  created() {
    this.$root.$on('onHideLanding', () => {
      this.showIntroduction = false;
    });
  },
  methods: {
  },
  computed: {
  },
});
</script>

<style lang="scss">
</style>
