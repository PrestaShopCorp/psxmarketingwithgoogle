<template>
  <b-modal
    v-bind="$attrs"
    v-on="$listeners"
    modal-class="ps_gs-modal"
    title-class="ps_gs-modal__title"
    header-class="ps_gs-modal__header"
    content-class="ps_gs-modal__content"
    footer-class="ps_gs-modal__footer"
    cancel-variant="outline-secondary"
    :static="true"
    :header-close-label="$t('cta.close')"
  >
    <slot />
  </b-modal>
</template>
<script>
import {BModal} from 'bootstrap-vue';

export default {
  name: 'PsModal',
  inheritAttrs: false,
  components: {BModal},
};
</script>
