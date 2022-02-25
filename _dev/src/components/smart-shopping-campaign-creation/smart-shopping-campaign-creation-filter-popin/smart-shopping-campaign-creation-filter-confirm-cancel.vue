<template>
  <ps-modal
    id="SSCampaignCreationFilterConfirmCancel"
    ref="modal"
    v-bind="$attrs"
    @ok="onAgreed"
    cancel-variant="invisible font-weight-normal"
    :title="$t('smartShoppingCampaignCreation.popinTitleConfirmCancel')"
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
import {checkAndUpdateDimensionStatus, deepCheckDimension} from '../../../utils/SSCFilters';

export default {
  name: 'SSCampaignCreationFilterConfirmCancel',
  components: {
    PsModal,
  },

  props: {
    stepIs: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    onAgreed() {
      this.$emit('sendStep', 1);
      deepCheckDimension(this.$store.state.smartShoppingCampaigns.dimensionChosen, false);
      checkAndUpdateDimensionStatus(this.$store.state.smartShoppingCampaigns.dimensionChosen);
    },
  },
};
</script>
