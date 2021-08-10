<template>
  <ps-modal
    id="GoogleAdsAccountPopinDisconnect"
    ref="modal"
    :title="$t('modal.titleDisconnectionGoogleAds')"
    v-bind="$attrs"
    @ok="onGoogleAdsAccountDissociationConfirmation"
    :cancel-disabled="processing"
    :ok-disabled="processing"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisconnectGoogleAds')"
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

export default {
  name: 'GoogleAdsAccountPopinDisconnect',
  components: {
    PsModal,
  },
  data() {
    return {
      processing: false,
    };
  },
  methods: {
    onGoogleAdsAccountDissociationConfirmation(bvModalEvt) {
      this.processing = true;
      bvModalEvt.preventDefault();
      this.$store.dispatch('googleAds/DISSOCIATE_GOOGLE_ADS_ACCOUNT').finally(
        () => {
          this.processing = false;
          this.$bvModal.hide('GoogleAdsAccountPopinDisconnect');
        },
      );
    },
  },
};
</script>
