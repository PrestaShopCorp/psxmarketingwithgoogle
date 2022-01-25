<template>
  <div>
    <b-form>
      <b-form-group
        :label="$t('smartShoppingCampaignCreation.selectProductsTitle')"
        label-class="font-weight-600 ps_gs-fz-16 d-block mb-0 p-0 bg-transparent border-0"
      >
        <p class="ps_gs-fz-13 text-secondary mb-3">
          {{ $t('smartShoppingCampaignCreation.selectProductsSubtitle') }}
        </p>
        <span
          v-if="!availableDimensions.length"
          class="text-muted"
        >
          <i class="icon-busy icon-busy--dark mr-1" />
          {{ $t("badge.loading") }}
        </span>
        <div v-else>
          <div
            v-for="(oneDim, index) in availableDimensions"
            :key="index"
          >
            <b-form-radio-group
              v-model="dimensionChosen"
              name="dimension"
              stacked
              class="pt-1"
              v-if="availableDimensions.length"
            >
              <b-form-radio
                name="dimension"
                :value="oneDim"
                class="mb-3"
              >
                <strong class="font-weight-normal d-block">
                  {{ oneDim.name }}
                </strong>
                <span class="ps_gs-fz-12 text-secondary d-block">
                  {{ oneDim.subtitle }}
                </span>
              </b-form-radio>
            </b-form-radio-group>
          </div>
        </div>
      </b-form-group>
      <div class="d-md-flex text-center justify-content-end mt-3 mb-2">
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
          :disabled="!dimensionChosen.name"
          class="mx-1 mt-3 mt-md-0 mr-md-0"
          variant="primary"
          @click="nextStep"
        >
          {{ $t("cta.next") }}
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'SmartShoppingCampaignCreationPopinDimension',

  props: {
    availableDimensions: {
      type: Array,
      required: true,
    },
  },

  computed: {
    dimensionChosen: {
      get() {
        let final = this.$store.state.smartShoppingCampaigns.dimensionChosen;
        if (this.$store.state.smartShoppingCampaigns.dimensionChosen) {
          final = {
            ...this.$store.state.smartShoppingCampaigns.dimensionChosen,
            name: this.$t(
              `smartShoppingCampaignCreation.${this.$store.state.smartShoppingCampaigns.dimensionChosen.id}`,
            ),
            subtitle: this.$t(
              `smartShoppingCampaignCreation.${this.$store.state.smartShoppingCampaigns.dimensionChosen.id}SubTitle`,
            ),
          };
        }
        return final;
      },
      set(value) {
        this.$emit('dimensionChosen', {
          reset: value.id !== this.dimensionChosen.id,
          newDimension: value,
        });
      },
    },
  },
  methods: {
    nextStep() {
      this.$emit('sendStep', 2);
    },
    confirmCancel() {
      this.$emit('confirmCancel');
    },
  },
};
</script>
