<template>
  <ps-modal
    id="ProductFeedPopinDisable"
    :title="$t('modal.titleDisableProductFeed')"
    v-bind="$attrs"
    ref="modal"
    @cancel="cancelDisabledProductFeed"
    @ok="onProductFeedDisableConfirmation"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisableProductFeed')"
    />
    <template slot="modal-cancel">
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.disableProductFeed") }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'ProductFeedPopinDisable',
  components: {
    PsModal,
  },
  methods: {
    onProductFeedDisableConfirmation() {
      this.$store.dispatch('productFeed/TOGGLE_SYNCHRONIZATION');
    },
    cancelDisabledProductFeed() {
      console.log('je cancel');
    },
  },
};
</script>
