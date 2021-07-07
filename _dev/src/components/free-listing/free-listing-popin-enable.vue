<template>
  <ps-modal
    id="FreeListingPopinEnable"
    :title="$t('modal.titleEnableFreeListing')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textEnableFreeListing')"
    />
    <template slot="modal-cancel">
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.enableFreeListing") }}
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

  name: 'FreeListingPopinEnable',
  components: {
    PsModal,
  },
};
</script>
