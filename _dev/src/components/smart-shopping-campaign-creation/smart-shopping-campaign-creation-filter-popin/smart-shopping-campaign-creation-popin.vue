<template>
  <div>
    <!-- :hide-footer="step !== 2 && totalNumberOfProducts === 0" -->
    <ps-modal
      :ok-disabled="totalNumberOfProducts === 0"
      hide-footer
      id="SmartShoppingCampaignCreationPopin"
      ref="modal"
      size="xl"
      v-bind="$attrs"
      cancel-variant="invisible font-weight-normal"
    >
      <b-form class="mb-4">
        <SmartShoppingCampaignCreationPopinDimension
          v-if="step === 1"
          :available-filters="availableFilters"
          @dimensionChosen="dimensionHasBeenSelected($event)"
          @sendStep="stepIs($event)"
          @confirmCancel="confirmCancel"
        />
        <SmartShoppingCampaignCreationPopinFilter
          v-if="step === 2"
          :available-filters="availableFilters"
          :dimension-chosen="dimensionChosen"
          @sendStep="stepIs($event)"
          @validateCreationFilters="sendDimensionsSelected"
        />
      </b-form>
    </ps-modal>
    <SmartShoppingCampaignCreationFilterConfirmCancel
      ref="SmartShoppingCampaignCreationFilterConfirmCancel"
      @confirmation="sendDimensionsSelected"
    />
  </div>
</template>

<script>
import PsModal from '../../commons/ps-modal';
import SmartShoppingCampaignCreationPopinDimension from './smart-shopping-campaign-creation-popin-dimension.vue';
import SmartShoppingCampaignCreationPopinFilter from './smart-shopping-campaign-creation-popin-filter.vue';
import SmartShoppingCampaignCreationFilterConfirmCancel from './smart-shopping-campaign-creation-filter-confirm-cancel.vue';
import {filterUncheckedSegments, getFilters} from '../../../utils/SSCFilters';

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
      dimensionChosen: null,
      step: 1,
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
    dimensionHasBeenSelected(dim) {
      this.dimensionChosen = dim;
    },
    stepIs(event) {
      this.step = event;
    },
    sendDimensionsSelected() {
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
