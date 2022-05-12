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
import {deleteProductFeedDataFromLocalStorage} from '@/utils/LocalStorage';

export default {
  name: 'ProductFeedPopinCancel',
  components: {
    PsModal,
  },
  methods: {
    onProductFeedCancelConfirmation() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
      this.$store.state.productFeed.attributesToMap
        .reduce((acc, curr) => [...acc, ...curr.fields], [])
        .forEach((fields) => {
          fields.mapped = null;
        });
      deleteProductFeedDataFromLocalStorage();
      this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
      this.$store.dispatch('productFeed/REQUEST_ATTRIBUTE_MAPPING');
      this.$router.push({
        name: 'configuration',
        hash: '#product-feed-card',
      });
    },
  },
};
</script>
