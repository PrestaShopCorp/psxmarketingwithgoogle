<template>
  <header class="ps_gs-landingpage-header d-flex flex-column flex-md-row">
    <div class="text-center">
      <div
        class="ps_gs-landingpage-header__logo d-flex justify-content-center bg-ocean-blue-50"
      >
        <img
          src="@/assets/images/prestashop-google-logo.svg"
          class="img-fluid mx-auto ml-md-0 mr-md-3 maxw-sm-420"
          alt="logo"
        >
        <span class="sr-only">{{ $t('landingPage.header.titleAccessibility') }}</span>
      </div>
      <h2 class="my-4">
        {{ $t('landingPage.header.title') }}
      </h2>
      <p>{{ $t('landingPage.header.text') }}</p>
      <b-button
        size="lg"
        variant="primary"
        @click="$emit('hideLandingPage')"
        data-test-id="lp-header-cta"
        :disabled="moduleNeedUpgrade"
      >
        {{ $t('cta.getStarted') }}
      </b-button>
    </div>
  </header>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppGettersTypes from '@/store/modules/app/getters-types';

export default defineComponent({
  name: 'LandingPageHeader',
  data() {
    return {
      moduleNeedUpgrade: false,
    };
  },
  methods: {
    async checkModuleNeedUpgrade() {
      this.moduleNeedUpgrade = await this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`]('psxmarketingwithgoogle');
    },
  },
  created() {
    this.checkModuleNeedUpgrade();
  },
});
</script>
