<template>
  <div id="configuration">
    <onboarding-page />
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import OnboardingPage from './onboarding-page.vue';

export default defineComponent({
  components: {
    OnboardingPage,
  },
});
</script>
