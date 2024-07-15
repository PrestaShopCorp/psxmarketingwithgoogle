<template>
  <div id="configuration">
    <monetization-messages>
      <template #content-modale>
        {{ $t('banner.monetization.popinUpdateConfigurationText') }}
      </template>
    </monetization-messages>

    <multistore-page v-if="!psAccountsContext.isShopContext && shops.length" />
    <onboarding-page v-else />
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import MultistorePage from './multistore-page.vue';
import OnboardingPage from './onboarding-page.vue';
import MonetizationMessages from '@/components/monetization/monetization-messages.vue';

export default defineComponent({
  components: {
    OnboardingPage,
    MultistorePage,
    MonetizationMessages,
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
