<template>
  <div>
    <b-form
      class="mb-5"
    >
      <b-form-group
        :label="$t('smartShoppingCampaignCreation.selectProductsTitle')"
        label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
      >
        <label class="mb-4">
          {{ $t('smartShoppingCampaignCreation.selectProductsSubtitle') }}
        </label>

        <div v-if="availableDimensions.length">
          <div
            v-for="(oneDim, index) in availableDimensions"
            :key="index"
          >
            <b-form-radio
              v-model="chosenOrModifiedDimension"
              name="dimension"
              :value="oneDim"
            >
              {{ oneDim.name }}
            </b-form-radio>
          </div>
        </div>
      </b-form-group>
    </b-form>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
        @click="confirmCancel"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        size="sm"
        :disabled="!chosenOrModifiedDimension"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
        @click="nextStep"
      >
        {{ $t("cta.next") }}
      </b-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SmartShoppingCampaignCreationPopinDimension',
  components: {
  },
  props: {
    availableDimensions: {
      type: Array,
      required: true,
    },
    dimensionChosen: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      chosenOrModifiedDimension: this.dimensionChosen ? this.dimensionChosen : null,
    };
  },
  methods: {
    nextStep() {
      let reset = false;
      // We check if there is already a dimension chosen, if so we will reset all checkbox
      if (this.dimensionChosen.name
       && (this.dimensionChosen.name !== this.chosenOrModifiedDimension.name)) {
        localStorage.removeItem('SSCDimensionsFiltered');
        reset = true;
      }
      this.$emit('dimensionChosen', {
        reset,
        newDimension: this.chosenOrModifiedDimension,
      });
      this.$emit('sendStep', 2);
    },
    confirmCancel() {
      this.$emit('confirmCancel');
    },
  },
};
</script>
