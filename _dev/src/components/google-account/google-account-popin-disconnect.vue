<template>
  <ps-modal
    id="GoogleAccountPopinDisconnect"
    ref="modal"
    :title="$t('modal.titleDisconnection')"
    v-bind="$attrs"
    @ok="onGoogleAccountDissociationConfirmation"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisconnectGoogleAccount')"
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
  name: 'GoogleAccountPopinDisconnect',
  components: {
    PsModal,
  },
  methods: {
    onGoogleAccountDissociationConfirmation() {
      this.$store.dispatch('accounts/DISSOCIATE_GOOGLE_ACCOUNT');
    },
  },
};
</script>
