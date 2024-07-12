<template>
  <div>
    <MonetizatizationBannerWarning
      v-if="modaleIsClosed && !moduleIsUpdated"
      @moduleUpdated="clickModuleUpdated"
    />
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
import MonetizationPopinUpdateModule from '@/components/monetization/monetization-popin-update-module.vue';
import MonetizatizationBannerWarning from '@/components/monetization/monetization-banner-warning.vue';
import PsToast from '@/components/commons/ps-toast.vue';
import AppGettersTypes from '@/store/modules/app/getters-types';

export default defineComponent({
  components: {
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
