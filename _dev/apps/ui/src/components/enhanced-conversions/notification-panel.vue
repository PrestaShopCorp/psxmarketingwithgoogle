<template>
  <div>
    <PsToast
      variant="success"
      toaster="b-toaster-top-right"
      ref="ecSuccessfullyEnabled"
    >
      <p>{{ $t('toast.enhancedConversionEnabledSuccess') }}</p>
    </PsToast>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from "vuex";
import GettersTypesCampaigns from "@/store/modules/campaigns/getters-types";
import GettersTypesGoogleAds from "@/store/modules/google-ads/getters-types";
import PsToast from '@/components/commons/ps-toast.vue';

export default defineComponent({
  components: {
    PsToast,
  },
  data() {
    return {
      hiddenProp: null as string|null,
      visibilityChangeEvent: null as string|null,
    };
  },
  computed: {
    ...mapGetters("campaigns", [
      GettersTypesCampaigns.GET_ENHANCED_CONVERSIONS_STATUS,
    ]),
    ...mapGetters("googleAds", [
      GettersTypesGoogleAds.GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED,
    ]),
  },
  methods: {
    async fetchData(): Promise<void> {
      if (!this.GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED) {
        await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      }
    },
    onWindowVisibilityChange() {
      // Watch when the page gets the focus, for instance
      // when the merchant comes back from another tab.
      if (document[this.hiddenProp] === false) {
        this.fetchData();
      }
    },
    registerToWindowVisibilityChangeEvent() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
      if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        this.hiddenProp = 'hidden';
        this.visibilityChangeEvent = 'visibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        this.hiddenProp = 'msHidden';
        this.visibilityChangeEvent = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        this.hiddenProp = 'webkitHidden';
        this.visibilityChangeEvent = 'webkitvisibilitychange';
      }

      if (document.addEventListener === 'undefined' || this.hiddenProp === null) {
        return;
      }
      document.addEventListener(
        this.visibilityChangeEvent,
        this.onWindowVisibilityChange,
        false,
      );
    },
  },
  watch: {
    GET_ENHANCED_CONVERSIONS_STATUS(newValue: boolean): void {
      if (newValue) {
        this.$bvToast.show(this.$refs.ecSuccessfullyEnabled.id);
      }
    },
  },
  beforeDestroy() {
    if (document.removeEventListener === 'undefined' || this.hiddenProp === null) {
      return;
    }
    document.removeEventListener(
      this.visibilityChangeEvent,
      this.onWindowVisibilityChange,
      false,
    );
  },
});
</script>
