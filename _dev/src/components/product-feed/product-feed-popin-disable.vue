<template>
  <ps-modal
    id="ProductFeedPopinDisable"
    :title="$t('modal.titleDisableProductFeed')"
    v-bind="$attrs"
    ref="modal"
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
  /**
   * TODO:
   * Handle all events:  close, click on cancel, click on ok, etc...
   */

  name: 'ProductFeedPopinDisable',
  components: {
    PsModal,
  },
  methods: {
    onProductFeedDisableConfirmation() {
      this.$store.dispatch('productFeed/TOGGLE_SYNCHRONIZATION');
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_STATUS',
        {name: 'isSuspendSync', data: !this.$store.state.productFeed.productFeed.status.isSuspendSync});
    },
  },
};
</script>
