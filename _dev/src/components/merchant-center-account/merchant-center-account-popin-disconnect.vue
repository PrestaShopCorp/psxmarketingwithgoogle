<template>
  <ps-modal
    id="MerchantCenterAccountPopinDisconnect"
    ref="modal"
    :title="$t('modal.titleDisconnection')"
    v-bind="$attrs"
    @ok="onMerchantCenterAccountDissociationConfirmation"
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
  name: 'MerchantCenterAccountPopinDisconnect',
  components: {
    PsModal,
  },
  methods: {
    onMerchantCenterAccountDissociationConfirmation() {
      this.$store.dispatch('accounts/DISSOCIATE_MERCHANT_CENTER_ACCOUNT');
    },
  },
};
</script>
