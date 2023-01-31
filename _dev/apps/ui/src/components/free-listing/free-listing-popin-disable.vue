<template>
  <ps-modal
    id="FreeListingPopinDisable"
    ref="modal"
    :title="$t('modal.titleDisableFreeListing')"
    v-bind="$attrs"
    @ok="disableProductFeed"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisableFreeListing')"
    />
    <template slot="modal-cancel">
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.disable") }}
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

  name: 'FreeListingPopinDisable',
  components: {
    PsModal,
  },
  methods: {
    disableProductFeed() {
      this.$store.dispatch('freeListing/SEND_FREE_LISTING_STATUS', false);
      this.$store.commit('freeListing/SAVE_ACTIVATED_ONCE', false);
    },
  },
};
</script>
