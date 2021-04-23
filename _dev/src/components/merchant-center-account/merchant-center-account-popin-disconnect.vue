<template>
  <ps-modal
    :visible="true"
    id="MerchantCenterAccountPopinDisconnect"
    title="Confirm disconnection?"
  >
    <p class="my-1">
      You are about to disconnect Google Merchant Center account. This will remove access to Google Merchant Center and Google Ads accounts.
    </p>
    <template slot="modal-ok">
      Disconnect account
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal'

export default {
  name: "MerchantCenterAccountPopinDisconnect",
  components: {
    PsModal
  },
  data() {
    return {
    };
  },
};
</script>
