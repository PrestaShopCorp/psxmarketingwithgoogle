<template>
  <ps-modal
    id="psxmarketingwithgoogle_modal_ec_intro"
    ref="psxmarketingwithgoogle_modal_ec_intro"
    :title="$t('modal.titleEnhancedConversionsIntro')"
    @ok="ok"
    @hidden="hidden"
    :visible="!isModalAlreadyAknowledged()"
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
    <VueShowdown
      class="mt-1 mb-4"
      :extensions="['extended-link']"
      :markdown="$t('modal.textActivationEnhancedConversionsIntro')"
      v-if="!tosAreSigned"
    />

    <template slot="modal-ok">
      {{ tosAreSigned ?
        $t('cta.enableEnhancedConversions') :
        $t('cta.signGadsToS')
      }}
    </template>
    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
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
  props: {
    tosAreSigned: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    linkToTermsOfServices(): string {
      return googleUrl.googleAdsConversionsTermsAndConditions;
    },
  },
  methods: {
    async ok(): Promise<void> {
      if (this.tosAreSigned) {
        this.enableEnhancedConversions();
        return;
      }
      this.openGoogleAdsTos();
    },
    openGoogleAdsTos(): void {
      window.open(this.linkToTermsOfServices, '_blank')?.focus();
    },
    async enableEnhancedConversions(): Promise<void> {
      await this.$store.dispatch('campaigns/SAVE_ENHANCED_CONVERSIONS_STATUS', true);
    },
    hidden(): void {
      this.doNotDisplayModalAnymore();
    },
    isModalAlreadyAknowledged(): boolean {
      return !!JSON.parse(localStorage.getItem(`enhancedConversionsIntroAck-${this.shopId}`) || 'false');
    },
    doNotDisplayModalAnymore(): void {
      localStorage.setItem(`enhancedConversionsIntroAck-${this.shopId}`, 'true');
    },
  },
});
</script>
