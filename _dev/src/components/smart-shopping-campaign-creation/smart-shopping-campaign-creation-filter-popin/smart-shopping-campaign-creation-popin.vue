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
      @closeModal="closeModal"
    />
    <SmartShoppingCampaignCreationPopinFilter
      v-if="step === 2"
      @sendStep="stepIs($event)"
      @validateCreationFilters="sendFiltersSelected"
      @confirmCancel="confirmCancel"
      :loader="loader"
    />
    <SmartShoppingCampaignCreationFilterConfirmCancel
      ref="SmartShoppingCampaignCreationFilterConfirmCancel"
      :step-is="step"
      @sendStep="stepIs($event)"
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
      return this.$store.getters['smartShoppingCampaigns/GET_SSC_DIMENSIONS_AND_FILTERS'];
    },
  },
  methods: {
    dimensionHasBeenSelected(obj) {
      const dimension = obj.reset ? deepCheckDimension(obj.newDimension, false) : obj.newDimension;
      this.$store.commit('smartShoppingCampaigns/SET_DIMENSION_CHOSEN', checkAndUpdateDimensionStatus(dimension));
    },
    stepIs(event) {
      this.step = event;
    },
    confirmCancel() {
      this.$bvModal.show(
        this.$refs.SmartShoppingCampaignCreationFilterConfirmCancel.$refs.modal.id,
      );
    },
    closeModal() {
      this.$bvModal.hide('SSCampaignCreationPopin');
    },
    sendFiltersSelected() {
      this.$emit('selectFilters', this.filteredDimensions);
      this.$bvModal.hide('SSCampaignCreationPopin');
    },
  },
};
</script>
