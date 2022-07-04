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
    <CampaignCreationPopinDimension
      v-if="step === 1 && availableDimensions"
      :available-dimensions="availableDimensions"
      @dimensionChosen="dimensionHasBeenSelected($event)"
      @sendStep="stepIs($event)"
      @closeModal="closeModal"
    />
    <CampaignCreationPopinFilter
      v-if="step === 2"
      @sendStep="stepIs($event)"
      @validateCreationFilters="sendFiltersSelected"
      @confirmCancel="confirmCancel"
      :search-loader="searchLoader"
    />
    <CampaignCreationFilterConfirmCancel
      ref="CampaignCreationFilterConfirmCancel"
      :step-is="step"
      @sendStep="stepIs($event)"
    />
  </ps-modal>
</template>

<script>
import PsModal from '../../commons/ps-modal';
import CampaignCreationPopinDimension from './campaign-creation-popin-dimension.vue';
import CampaignCreationPopinFilter from './campaign-creation-popin-filter.vue';
import CampaignCreationFilterConfirmCancel from './campaign-creation-filter-confirm-cancel.vue';
import {
  filterUncheckedSegments, getFilters, deepCheckDimension, checkAndUpdateDimensionStatus,
} from '../../../utils/SSCFilters';

export default {
  name: 'SSCampaignCreationPopin',
  components: {
    PsModal,
    CampaignCreationPopinDimension,
    CampaignCreationPopinFilter,
    CampaignCreationFilterConfirmCancel,
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
    searchLoader: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    dimensionChosen() {
      return this.$store.state.campaigns.dimensionChosen;
    },
    filteredDimensions() {
      return filterUncheckedSegments(this.dimensionChosen);
    },
    totalNumberOfFilters() {
      return getFilters(this.filteredDimensions, []).length;
    },
    availableDimensions() {
      return this.$store.getters['campaigns/GET_SSC_DIMENSIONS_AND_FILTERS'];
    },
  },
  methods: {
    dimensionHasBeenSelected(obj) {
      const dimension = obj.reset ? deepCheckDimension(obj.newDimension, false) : obj.newDimension;
      this.$store.commit('campaigns/SET_DIMENSION_CHOSEN', checkAndUpdateDimensionStatus(dimension));
    },
    stepIs(event) {
      this.step = event;
    },
    confirmCancel() {
      this.$bvModal.show(
        this.$refs.CampaignCreationFilterConfirmCancel.$refs.modal.id,
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
