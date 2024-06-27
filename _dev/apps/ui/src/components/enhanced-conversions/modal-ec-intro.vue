<template>
  <ps-modal
    id="psxmarketingwithgoogle_modal_ec_intro"
    ref="psxmarketingwithgoogle_modal_ec_intro"
    :title="$t('modal.titleEnhancedConversionsIntro')"
    @ok="openGoogleAdsTos"
    @hidden="hidden"
    :visible="displayModal"
  >
    <img
      src="@/assets/images/empty-cart.svg"
      width="250"
      height="170"
    >
    <VueShowdown
      class="mt-1 mb-4"
      :extensions="['extended-link']"
      :markdown="$t('modal.textEnhancedConversionsIntro')"
    />

    <template slot="modal-ok">
      {{ $t('cta.enableEnhancedConversions') }}
    </template>
    <template slot="modal-cancel">
      {{ $t('cta.close') }}
    </template>
  </ps-modal>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';
import PsModal from '@/components/commons/ps-modal.vue';

export default defineComponent({
  name: 'ModalEcIntro',
  components: {
    PsModal,
  },
  data() {
    return {
      displayModal: false as boolean,
    };
  },
  computed: {
    linkToTermsOfServices(): string {
      return googleUrl.googleAdsEnhancedCoversionSettings;
    },
  },
  methods: {
    openGoogleAdsTos(): void {
      window.open(this.linkToTermsOfServices, '_blank')?.focus();
      this.enableEnhancedConversions();
    },
    async enableEnhancedConversions(): Promise<void> {
      await this.$store.dispatch('campaigns/SAVE_ENHANCED_CONVERSIONS_STATUS', true);
    },
    hidden(): void {
      this.acknowledgeFeature();
    },
    async checkFeatureHasBeenIntroduced(): Promise<void> {
      this.displayModal = !(await this.$store.dispatch('campaigns/GET_ENHANCED_CONVERSIONS_INTRODUCTION_STATUS'));
    },
    async acknowledgeFeature(): Promise<void> {
      await this.$store.dispatch('campaigns/SAVE_ENHANCED_CONVERSIONS_INTRODUCTION_STATUS', true);
    },
  },
  mounted() {
    this.checkFeatureHasBeenIntroduced();
  },
});
</script>
