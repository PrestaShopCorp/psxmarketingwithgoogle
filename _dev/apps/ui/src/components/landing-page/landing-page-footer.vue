<template>
  <footer class="text-center">
    <b-row class="flex-column flex-sm-row">
      <b-col>
        <h4 class="mb-3">
          {{ $t("landingPage.footer.text") }}
        </h4>
        <b-button
          size="lg"
          variant="primary"
          @click="$emit('hideLandingPage')"
          :disabled="moduleNeedUpgrade"
          data-test-id="lp-footer-cta"
        >
          {{ $t("cta.getStarted") }}
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
