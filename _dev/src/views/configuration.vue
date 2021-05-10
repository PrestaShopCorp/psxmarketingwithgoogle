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
      showIntroduction: true,
    };
  },
  created() {
    this.$root.$on('onHideLanding', () => {
      this.showIntroduction = false;
    });
    // this.$store.dispatch('accounts/TRIGGER_ONBOARD_TO_GOOGLE_ACCOUNT', 'www.google.com');
  },
  methods: {
  },
  computed: {
    psAccountsIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
  },
});
</script>

<style lang="scss">
</style>
