<template>
  <ps-modal
    id="MerchantCenterAccountPopinOverwriteClaim"
    :title="$t('modal.titleOverwriteClaim')"
    v-bind="$attrs"
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
};
</script>
