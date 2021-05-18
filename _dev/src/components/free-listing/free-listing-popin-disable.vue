<template>
  <ps-modal
    id="FreeListingPopinDisable"
    :title="$t('modal.titleDisableFreeListing')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisableFreeListing')"
    />
    <template slot="modal-cancel">
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.disableFreeListing") }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  /**
   * TODO:
   * Handle all events:  close, click on cancel, click on ok, etc...
   */

  name: 'FreeListingPopinDisable',
  components: {
    PsModal,
  },
};
</script>
