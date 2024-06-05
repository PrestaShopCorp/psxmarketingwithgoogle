<template>
  <ps-modal
    id="ProductFeedPopinCancel"
    ref="modal"
    :title="$t('modal.titleQuitWithoutSaving')"
    v-bind="$attrs"
    @ok="$emit('continue-leave')"
    @cancel="$emit('cancel-leave')"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textCancelProductFeed')"
    />
    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.continue') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'ProductFeedPopinCancel',
  components: {
    PsModal,
  },
};
</script>
