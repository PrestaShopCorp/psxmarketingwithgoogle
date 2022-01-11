<template>
  <ps-modal
    :ok-disabled="totalNumberOfFilters === 0"
    hide-footer
    id="SSCampaignCreationPopin"
    ref="modal"
    size="xl"
    v-bind="$attrs"
    cancel-variant="invisible font-weight-normal"
    :title="'Campaign’s products filters'"
  >
    <SmartShoppingCampaignCreationPopinDimension
      v-if="step === 1"
      :available-dimensions="availableDimensions"
      :dimension-chosen="dimensionChosen"
      @dimensionChosen="dimensionHasBeenSelected($event)"
      @sendStep="stepIs($event)"
      @confirmCancel="confirmCancel"
    />
    <SmartShoppingCampaignCreationPopinFilter
      v-if="step === 2"
      :dimension-chosen="dimensionChosen"
      @sendStep="stepIs($event)"
      @validateCreationFilters="sendFiltersSelected"
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
      dimensionChosen: {},
      step: 1,
    };
  },
  computed: {
    filteredDimensions() {
      return filterUncheckedSegments(this.dimensionChosen);
    },
    totalNumberOfFilters() {
      return getFilters(this.filteredDimensions, []).length;
    },
    availableDimensions: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_SSC_DIMENSIONS_AND_FILTERS'];
      },
      set(value) {
        console.log('commit value', value);
      },
    },
  },
  methods: {
    dimensionHasBeenSelected(obj) {
      if (obj.reset) {
        deepCheckDimension(this.dimensionChosen, false);
        checkAndUpdateDimensionStatus(this.dimensionChosen);
      }
      this.dimensionChosen = obj.newDimension;
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
