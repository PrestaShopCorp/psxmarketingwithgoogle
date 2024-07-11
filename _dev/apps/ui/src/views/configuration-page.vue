<template>
  <div id="configuration">
    <MonetizatizationBannerWarning
      v-if="modaleIsClosed && !moduleIsUpdated"
      @moduleUpdated="clickModuleUpdated"
    />
    <multistore-page v-if="!psAccountsContext.isShopContext && shops.length" />
    <onboarding-page v-else />

    <!-- Monetization Modale -->
    <MonetizationPopinUpdateModule
      v-if="moduleNeedUpgrade && !moduleIsUpdated"
      @clickUpdateModule="moduleIsUpdated = true"
      @closeModale="modaleIsClosed = true"
    />
    <PsToast
      v-if="moduleIsUpdated"
      variant="success"
      :visible="moduleIsUpdated"
      toaster="b-toaster-top-right"
      body-class="border border-success"
    >
      <p>{{ $t("toast.moduleUpdated") }}</p>
    </PsToast>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import MultistorePage from './multistore-page.vue';
import OnboardingPage from './onboarding-page.vue';
import MonetizationPopinUpdateModule from '../components/monetization/monetization-popin-update-module.vue';
import MonetizatizationBannerWarning from '../components/monetization/monetization-banner-warning.vue';
import AppGettersTypes from '@/store/modules/app/getters-types';
import PsToast from '@/components/commons/ps-toast.vue';

export default defineComponent({
  components: {
    OnboardingPage,
    MultistorePage,
    MonetizationPopinUpdateModule,
    MonetizatizationBannerWarning,
    PsToast,
  },
  data() {
    return {
      moduleIsUpdated: false,
      modaleIsClosed: false,
    };
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
    moduleNeedUpgrade() {
      return this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`](this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded);
    },
  },
  methods: {
    clickModuleUpdated() {
      this.displayBanner = false;
      this.moduleIsUpdated = true;
    },
  },
});
</script>
