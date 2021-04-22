<template>
  <b-modal
    :visible="true"
    id="MerchantCenterAccountPopinDisconnect"
    title="Confirm disconnection?"
    title-class="font-weight-600"
  >
    <p class="my-4">You are about to disconnect Google Merchant Center account. This will remove access to Google Merchant Center and Google Ads accounts.</p>
    <template slot="modal-ok">
      Disconnect
    </template>
  </b-modal>
</template>

<script>
import { BModal } from 'bootstrap-vue';

export default {
  name: "MerchantCenterAccountPopinDisconnect",
  components: {
    BModal,
  },
  data() {
    return {
    };
  },
};
</script>
