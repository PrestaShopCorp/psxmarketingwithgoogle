<template>
  <ps-modal
    :ok-disabled="totalNumberOfProducts === 0"
    id="SmartShoppingCampaignCreationPopin"
    ref="modal"
    size="xl"
    hide-footer
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
      :available-filters="availableFilters"
      :dimension-chosen="dimensionChosen"
      @sendStep="stepIs($event)"
      @validateCreationFilters="sendFiltersSelected"
      @filterByName="filtersAreChosenByName"
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
  name: 'SmartShoppingCampaignCreationPopin',
  components: {
    PsModal,
    SmartShoppingCampaignCreationPopinDimension,
    SmartShoppingCampaignCreationPopinFilter,
    SmartShoppingCampaignCreationFilterConfirmCancel,
  },
  props: {
    availableFilters: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchString: '',
      dimensionChosen: {},
      step: 1,
      availableDimensions: this.availableFilters.children,
    };
  },
  computed: {
    textFiltersSelected() {
      return this.$i18n.tc('smartShoppingCampaignCreation.nbValuesSelected',
        this.totalNumberOfProducts,
        [this.totalNumberOfProducts]);
    },
    filteredDimensions() {
      return filterUncheckedSegments(this.availableFilters);
    },
    totalNumberOfProducts() {
      return getFilters(this.filteredDimensions, []).length;
    },
  },
  methods: {
    dimensionHasBeenSelected(obj) {
      if (obj.reset) {
        deepCheckDimension(this.availableFilters, false);
        checkAndUpdateDimensionStatus(this.availableFilters);
      }
      this.dimensionChosen = obj.newDimension;
    },
    filtersAreChosenByName(filters) {
      this.dimensionChosen = {
        ...this.dimensionChosen,
        children: filters,
      };
    },
    stepIs(event) {
      this.step = event;
    },
    sendFiltersSelected() {
      this.$emit('selectFilters', this.filteredDimensions);
      this.$bvModal.hide('SmartShoppingCampaignCreationPopin');
    },
    confirmCancel() {
      this.$bvModal.show(
        this.$refs.SmartShoppingCampaignCreationFilterConfirmCancel.$refs.modal.id,
      );
    },
  },
};
</script>
