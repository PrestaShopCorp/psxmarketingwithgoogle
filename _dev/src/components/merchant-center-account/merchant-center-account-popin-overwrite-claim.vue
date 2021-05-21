<template>
  <ps-modal
    id="MerchantCenterAccountPopinOverwriteClaim"
    ref="modal"
    :title="$t('modal.titleOverwriteClaim')"
    v-bind="$attrs"
    @ok="onMCAOverrideClaim"
    @cancel="onChangeAccount"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textOverwriteClaim')"
    />
    <template slot="modal-cancel">
      {{ $t('cta.switchAccount') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.overwriteClaim') }}
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

  name: 'MerchantCenterAccountPopinOverwriteClaim',
  components: {
    PsModal,
  },
  methods: {
    onMCAOverrideClaim() {
      this.$store.dispatch('accounts/REQUEST_TO_OVERRIDE_CLAIM');
    },
    onChangeAccount() {
      this.$store.dispatch('accounts/DISSOCIATE_MERCHANT_CENTER_ACCOUNT');
    },
  },
};
</script>
