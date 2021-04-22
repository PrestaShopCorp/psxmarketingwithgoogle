<template>
  <b-modal
    :visible="true"
    id="MerchantCenterAccountPopinDisconnect"
    title="Confirm disconnection?"
    modal-class="ps_gs-modal"
    title-class="ps_gs-modal__title"
    header-class="ps_gs-modal__header"
    content-class="ps_gs-modal__content"
    footer-class="ps_gs-modal__footer"
    cancel-variant="outline-secondary"
  >
    <p class="my-1">You are about to disconnect Google Merchant Center account. This will remove access to Google Merchant Center and Google Ads accounts.</p>
    <template slot="modal-ok">
      Disconnect account
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
