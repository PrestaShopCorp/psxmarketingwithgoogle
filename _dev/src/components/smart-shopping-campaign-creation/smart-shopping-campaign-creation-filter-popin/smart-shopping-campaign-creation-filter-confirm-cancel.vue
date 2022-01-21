<template>
  <ps-modal
    id="SSCampaignCreationFilterConfirmCancel"
    ref="modal"
    v-bind="$attrs"
    @ok="onAgreed"
    cancel-variant="invisible font-weight-normal"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textConfirmCancel')"
    />
    <template slot="modal-cancel">
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.agree") }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../../commons/ps-modal';

export default {
  name: 'SSCampaignCreationFilterConfirmCancel',
  components: {
    PsModal,
  },

  methods: {
    onAgreed() {
      this.$emit('confirmation');
      this.$bvModal.hide('GoogleAdsAccountPopinDisconnect');
    },
  },

};
</script>
