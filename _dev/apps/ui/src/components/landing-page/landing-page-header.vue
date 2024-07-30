<template>
  <header class="ps_gs-landingpage-header d-flex flex-column flex-md-row">
    <div>
      <h2
        class="ps_gs-landingpage-header__title d-flex mr-3"
      >
        <img
          src="@/assets/images/prestashop-google-logo.svg"
          class="img-fluid mx-auto ml-md-0 mr-md-3 maxw-sm-420"
          alt="logo"
        >
        <span class="sr-only">{{ $t('landingPage.header.title') }}</span>
      </h2>
      <p class="ps_gs-landingpage-header__text w-50">
        {{ $t('landingPage.header.text') }}
      </p>
      <div class="d-inline-flex flex-column">
        <b-button
          size="lg"
          variant="primary"
          class="my-2"
          @click="$emit('hideLandingPage')"
          data-test-id="lp-header-cta"
          :disabled="moduleNeedUpgrade"
        >
          {{ $t('cta.startConfiguring') }}
        </b-button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppGettersTypes from '@/store/modules/app/getters-types';

export default defineComponent({
  name: 'LandingPageHeader',
  computed: {
    moduleNeedUpgrade() {
      return this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`](this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded);
    },
  },
});
</script>
