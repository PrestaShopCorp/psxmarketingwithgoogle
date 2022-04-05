<template>
  <ps-modal
    id="ProductFeedPopinCancel"
    ref="modal"
    :title="$t('modal.titleQuitWithoutSaving')"
    v-bind="$attrs"
    @ok="onProductFeedCancelConfirmation"
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
  methods: {
    onProductFeedCancelConfirmation() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
      this.$router.push({
        name: 'configuration',
        hash: '#product-feed-card',
      });
    },
  },
};
</script>
