<template>
  <ps-modal
    id="SSCPopinActivateTracking"
    ref="modal"
    :title="$t('modal.titleActivateTrackingSSC')"
    v-bind="$attrs"
    @ok="changeTrackingStatus(true)"
  >
    <!-- TODO  : missing links -->
    <VueShowdown
      class="my-1"
      :extensions="['extended-link']"
      :markdown="$t('modal.textActivateTrackingSSC', ['http://google.fr', 'http://google.fr'])"
    />
    <template
      slot="modal-cancel"
    >
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.continue") }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {

  name: 'SSCPopinActivateTracking',
  components: {
    PsModal,
  },
  computed: {
    trackingStatus() {
      return this.$store.state.smartShoppingCampaigns.tracking;
    },
  },
  methods: {
    changeTrackingStatus(status) {
      this.$store.dispatch('smartShoppingCampaigns/SAVE_STATUS_REMARKETING_TRACKING_TAGS', status);
      this.$router.push({
        name: 'campaign-creation',
      });
    },
  },
};
</script>
