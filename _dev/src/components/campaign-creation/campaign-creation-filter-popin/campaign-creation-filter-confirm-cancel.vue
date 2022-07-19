<template>
  <ps-modal
    id="SSCampaignCreationFilterConfirmCancel"
    ref="modal"
    v-bind="$attrs"
    @ok="onAgreed"
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
import {findAndCheckFilter} from '../../../utils/SSCFilters';

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
      //  Reset filters to what it was previously saved (in store or in edition)
      findAndCheckFilter(
        this.$store.state.campaigns.dimensionChosen,
        this.$store.getters['campaigns/GET_CAMPAIGN_FILTER_CHOSEN']?.values || [],
      );
    },
  },
};
</script>
