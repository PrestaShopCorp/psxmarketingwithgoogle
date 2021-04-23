<script>
/**
 ** ps-modal extends b-modal from bootstrap-vue
 ** it allows us to add default props value,
 ** such as specific classes and buttons variants.
 */

import { BModal } from 'bootstrap-vue';

export default {
  name: 'PsModal',
  extends: BModal,
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
    contentClass: {
      default: 'ps_gs-modal__content',
    },
    footerClass: {
      default: 'ps_gs-modal__footer',
    },
    cancelVariant: {
      default: 'outline-secondary',
    },
  },
}
</script>
