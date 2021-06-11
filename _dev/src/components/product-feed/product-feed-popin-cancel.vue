<template>
  <ps-modal
    id="ProductFeedPopinCancel"
    ref="modal"
    :title="$t('modal.titleCancelWithoutSaving')"
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
      {{ $t('cta.continueWithoutSave') }}
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
      this.$store.commit('productFeed/TOGGLE_CONFIGURATION_STARTED');
      this.$router.push({
        path: '/onboarding',
      });
    },
  },
};
</script>
