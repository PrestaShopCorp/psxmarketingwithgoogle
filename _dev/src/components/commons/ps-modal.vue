<template>
  <b-modal
    v-bind="$attrs"
    v-on="$listeners"
    modalClass="ps_gs-modal"
    titleClass="ps_gs-modal__title"
    headerClass="ps_gs-modal__header"
    contentClass="ps_gs-modal__content"
    footerClass="ps_gs-modal__footer"
    cancelVariant="outline-secondary"
    :static="true"
    :headerCloseLabel="$t('cta.close')"
  >
    <slot />
  </b-modal>
</template>
<script>
import { BModal } from "bootstrap-vue";

export default {
  name: 'PsModal',
  inheritAttrs: false,
  components: { BModal },
};
</script>
