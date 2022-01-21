<template>
  <ps-modal
    :ok-disabled="totalNumberOfFilters === 0"
    hide-footer
    id="SSCampaignCreationPopin"
    ref="modal"
    size="xl"
    v-bind="$attrs"
    cancel-variant="invisible font-weight-normal"
    :title="$t('smartShoppingCampaignCreation.popinTitle')"
  >
    <SmartShoppingCampaignCreationPopinDimension
      v-if="step === 1 && availableDimensions"
      :available-dimensions="availableDimensions"
      @dimensionChosen="dimensionHasBeenSelected($event)"
      @sendStep="stepIs($event)"
      @confirmCancel="confirmCancel"
    />
    <SmartShoppingCampaignCreationPopinFilter
      v-if="step === 2"
      @sendStep="stepIs($event)"
      @validateCreationFilters="sendFiltersSelected"
      :loader="loader"
    />
    <SmartShoppingCampaignCreationFilterConfirmCancel
      ref="SmartShoppingCampaignCreationFilterConfirmCancel"
      @confirmation="sendFiltersSelected"
    />
  </ps-modal>
</template>

<script>
import PsModal from '../../commons/ps-modal';
import SmartShoppingCampaignCreationPopinDimension from './smart-shopping-campaign-creation-popin-dimension.vue';
import SmartShoppingCampaignCreationPopinFilter from './smart-shopping-campaign-creation-popin-filter.vue';
import SmartShoppingCampaignCreationFilterConfirmCancel from './smart-shopping-campaign-creation-filter-confirm-cancel.vue';
import {
  filterUncheckedSegments, getFilters, deepCheckDimension, checkAndUpdateDimensionStatus,
} from '../../../utils/SSCFilters';

export default {
  name: 'SSCampaignCreationPopin',
  components: {
    PsModal,
    SmartShoppingCampaignCreationPopinDimension,
    SmartShoppingCampaignCreationPopinFilter,
    SmartShoppingCampaignCreationFilterConfirmCancel,
  },

  data() {
    return {
      searchString: '',
      step: 1,
    };
  },
  props: {
    loader: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    dimensionChosen() {
      return this.$store.state.smartShoppingCampaigns.dimensionChosen;
    },
    filteredDimensions() {
      return filterUncheckedSegments(this.dimensionChosen);
    },
    totalNumberOfFilters() {
      return getFilters(this.filteredDimensions, []).length;
    },
    availableDimensions() {
      const final = this.$store.getters['smartShoppingCampaigns/GET_SSC_DIMENSIONS_AND_FILTERS'].map((fil) => ({
        ...fil,
        name: this.$t(`smartShoppingCampaignCreation.${fil.id}`),
        subtitle: this.$t(`smartShoppingCampaignCreation.${fil.id}SubTitle`),
      }));
      return final;
    },
  },
  methods: {
    dimensionHasBeenSelected(obj) {
      if (obj.reset) {
        let resultDimension = deepCheckDimension(this.dimensionChosen, false);
        resultDimension = checkAndUpdateDimensionStatus(this.dimensionChosen);
        this.$store.commit('smartShoppingCampaigns/SET_DIMENSION_CHOSEN', resultDimension);
      }
      this.$store.commit('smartShoppingCampaigns/SET_DIMENSION_CHOSEN', obj.newDimension);
    },
    stepIs(event) {
      this.step = event;
    },
    sendFiltersSelected() {
      this.$emit('selectFilters', this.filteredDimensions);
      this.$bvModal.hide('SSCampaignCreationPopin');
    },
    confirmCancel() {
      this.$bvModal.show(
        this.$refs.SmartShoppingCampaignCreationFilterConfirmCancel.$refs.modal.id,
      );
    },
  },
};
</script>
