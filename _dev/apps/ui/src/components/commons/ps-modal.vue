<script>
/**
 ** ps-modal extends b-modal from bootstrap-vue
 ** it allows us to add default props value,
 ** such as specific classes and buttons variants.
 */

import {BModal} from 'bootstrap-vue';

export default {
  name: 'PsModal',
  extends: BModal,
  /**
   * As I'm extending a component, I don't want to overwrite props type
   * That's why I'm disabling this specific eslint rule
   */
  /* eslint-disable vue/require-prop-types */
  props: {
    modalClass: {
      default: 'ps_gs-modal',
    },
    titleClass: {
      default: 'ps_gs-modal__title',
    },
    headerClass: {
      default: 'ps_gs-modal__header',
    },
    bodyClass: {
      default: 'ps_gs-modal__body',
    },
    contentClass: {
      default: 'ps_gs-modal__content',
    },
    footerClass: {
      default: 'ps_gs-modal__footer',
    },
    cancelVariant: {
      default: 'outline-secondary',
    },
    static: {
      default: true,
    },
  },
  /* eslint-enable vue/require-prop-types */
};

</script>
