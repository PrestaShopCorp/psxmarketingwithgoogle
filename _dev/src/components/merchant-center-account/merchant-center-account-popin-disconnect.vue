<template>
  <ps-modal
    id="MerchantCenterAccountPopinDisconnect"
    :title="$t('modal.titleDisconnection')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisconnectMCA')"
    />
    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.disconnectAccount') }}
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

  name: 'MerchantCenterAccountPopinDisconnect',
  components: {
    PsModal,
  },
};
</script>
