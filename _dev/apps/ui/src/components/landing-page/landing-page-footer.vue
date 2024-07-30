<template>
  <footer class="ps_gs-landingpage-footer text-center">
    <b-row class="flex-column flex-sm-row">
      <b-col>
        <p class="ps_gs-landingpage-footer__text mb-3">
          {{ $t("landingPage.footer.text") }}
        </p>
        <b-button
          size="lg"
          variant="primary"
          @click="$emit('hideLandingPage')"
          :disabled="moduleNeedUpgrade"
          data-test-id="lp-footer-cta"
        >
          {{ $t("cta.startConfiguring") }}
        </b-button>
      </b-col>
    </b-row>
  </footer>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppGettersTypes from '@/store/modules/app/getters-types';

export default defineComponent({
  name: 'LandingPageFooter',
  computed: {
    moduleNeedUpgrade() {
      return this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`](this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded);
    },
  },
});
</script>
