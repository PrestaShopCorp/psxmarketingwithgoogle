<template>
  <ps-modal
    id="psxmarketingwithgoogle_modal_ec_intro"
    ref="psxmarketingwithgoogle_modal_ec_intro"
    :title="$t('modal.titleEnhancedConversionsIntro')"
    hide-footer
    visible
  >
    <img
      src="@/assets/images/empty-cart.svg"
      width="250"
      height="170" 
    />
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

    <div
      class="my-4 d-flex justify-content-end"
    >
      <b-button
        v-if="tosAreSigned"
        @click="openGadsTos"
      >
        {{ $t('cta.signGadsToS') }}
      </b-button>
      
      <b-button
        v-else
        @click="enabledEnhancedConversions"
      >
        {{ $t('cta.enableEnhancedConversions') }}
      </b-button>
    </div>
  </ps-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
  methods: {
    openGadsTos(): void {
      // TODO
    },
    enabledEnhancedConversions(): void {
      // TODO
    },
  },
});
</script>