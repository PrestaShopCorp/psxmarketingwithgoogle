<template>
  <ps-modal
    id="ProductFeedPopinOverwriteFeed"
    ref="modal"
    :title="$t('modal.titleOverwriteProductFeed')"
    v-bind="$attrs"
    @ok="onProductFeedOverwriteConfirmation"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textOverwriteProductFeed')"
    />
    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.overwrite') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'ProductFeedPopinOverwriteFeed',
  components: {
    PsModal,
  },
  methods: {
    onProductFeedOverwriteConfirmation() {
      // TODO: handle method
    },
  },
};
</script>
