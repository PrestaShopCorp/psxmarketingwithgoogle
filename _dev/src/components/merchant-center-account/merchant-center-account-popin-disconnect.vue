<template>
  <ps-modal
    id="MerchantCenterAccountPopinDisconnect"
    ref="modal"
    :title="$t('modal.titleDisconnectionMerchantCenter')"
    v-bind="$attrs"
    @ok="onMerchantCenterAccountDissociationConfirmation"
    :cancel-disabled="processing"
    :ok-disabled="processing"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisconnectMCA')"
    />
    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.disconnect') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';
import {deleteProductFeedDataFromLocalStorage} from '@/utils/LocalStorage';

export default {
  name: 'MerchantCenterAccountPopinDisconnect',
  components: {
    PsModal,
  },
  data() {
    return {
      processing: false,
    };
  },
  methods: {
    onMerchantCenterAccountDissociationConfirmation(bvModalEvt) {
      this.processing = true;
      bvModalEvt.preventDefault();
      this.$store.dispatch('accounts/DISSOCIATE_GMC').finally(
        () => {
          this.processing = false;
          this.$bvModal.hide('MerchantCenterAccountPopinDisconnect');
          deleteProductFeedDataFromLocalStorage();
        },
      );
    },
  },
};
</script>
