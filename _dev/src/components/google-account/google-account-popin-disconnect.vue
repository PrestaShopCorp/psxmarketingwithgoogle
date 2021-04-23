<template>
  <ps-modal
    id="GoogleAccountPopinDisconnect"
    :title="$t('modal.titleDisconnection')"
    v-bind="$attrs"
  >
    <p class="my-1">
      {{ $t('modal.textDisconnectGoogleAccount') }}
    </p>
    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.disconnectAccount') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal'

export default {
  name: "GoogleAccountPopinDisconnect",
  components: {
    PsModal
  },
  data() {
    return {
    };
  },
};
</script>
