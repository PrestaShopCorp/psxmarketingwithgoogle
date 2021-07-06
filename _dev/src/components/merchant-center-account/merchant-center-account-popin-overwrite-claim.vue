<template>
  <ps-modal
    id="MerchantCenterAccountPopinoverwrite"
    ref="modal"
    :title="$t('modal.titleoverwrite')"
    v-bind="$attrs"
    @ok="onGMCOverrideClaim"
    @cancel="onChangeAccount"
    :cancel-disabled="processing"
    :ok-disabled="processing"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textoverwrite')"
    />
    <template slot="modal-cancel">
      {{ $t('cta.switchAccount') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.overwrite') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'MerchantCenterAccountPopinOverwriteClaim',
  components: {
    PsModal,
  },
  data() {
    return {
      processing: false,
    };
  },
  methods: {
    onGMCOverrideClaim(bvModalEvt) {
      this.processing = true;
      bvModalEvt.preventDefault();
      this.$store.dispatch('accounts/REQUEST_TO_OVERRIDE_CLAIM').finally(
        () => {
          this.processing = false;
          this.$bvModal.hide('MerchantCenterAccountPopinoverwrite');
        },
      );
    },
    onChangeAccount(bvModalEvt) {
      this.processing = true;
      bvModalEvt.preventDefault();
      this.$store.dispatch('accounts/DISSOCIATE_GMC').finally(
        () => {
          this.processing = false;
          this.$bvModal.hide('MerchantCenterAccountPopinoverwrite');
        },
      );
    },
  },
};
</script>
