<template>
  <ps-modal
    id="MerchantCenterAccountPopinOverwriteClaim"
    :title="$t('modal.titleOverwriteClaim')"
    v-bind="$attrs"
  >
    <p class="my-1">
      {{ $t('modal.textDisconnectMCA') }}
    </p>
    <template slot="modal-cancel">
      {{ $t('cta.switchAccount') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.overwriteClaim') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal'

export default {
  name: "MerchantCenterAccountPopinOverwriteClaim",
  components: {
    PsModal
  },
  data() {
    return {
    };
  },
};
</script>
