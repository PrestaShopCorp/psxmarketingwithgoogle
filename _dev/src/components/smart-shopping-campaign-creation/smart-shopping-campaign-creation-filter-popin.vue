<template>
  <ps-modal
    id="SmartShoppingCampaignCreationFilterPopin"
    ref="modal"
    size="xl"
    v-bind="$attrs"
    @ok="sendDimensionsSelected"
    cancel-variant="invisible font-weight-normal"
  >
    <b-form>
      <h5 class="ps_gs-fz-16 font-weight-600 mb-1">
        {{ $t('smartShoppingCampaignCreation.selectProductsTitle') }}
      </h5>
      <p class="ps_gs-fz-16 mb-4">
        {{ $t('smartShoppingCampaignCreation.selectProductsSubtitle') }}
      </p>
      <b-form-group>
        <b-row>
          <b-col
            v-if="availableFilters.children.length"
            cols="12"
            md="6"
            class="mb-3 mb-md-0"
          >
            <h6 class="ps_gs-fz-16 font-weight-normal">
              {{ $t('smartShoppingCampaignCreation.labelDimensionValue') }}
            </h6>
            <ps-select
              :options="availableFilters.children"
              :deselect-from-dropdown="true"
              @input="selectDimension"
              @search="searchDimension"
              label="name"
              placeholder="Dimension"
              class="maxw-sm-500"
            >
              <template v-slot:option="option">
                <span v-html="highlightSearch(`${option.name}`)" />
              </template>
            </ps-select>
          </b-col>
          <b-col
            cols="12"
            md="6"
            class="mb-3 mb-md-0"
          >
            <h6 class="ps_gs-fz-16 font-weight-normal">
              {{ $t('smartShoppingCampaignCreation.labelSelectedDimension') }}
            </h6>
            <ul class="ps_gs-filters">
              <SmartShoppingCampaignCreationFilterItem
                v-if="dimensionChosen"
                :item="dimensionChosen"
                :is-open-by-default="true"
              />
              <div v-else>
                {{ $t('smartShoppingCampaignCreation.selectFilterInfo') }}
              </div>
            </ul>
          </b-col>
          <b-col
            cols="12"
          >
            {{ $t('smartShoppingCampaignCreation.infos') }}
          </b-col>
          <b-col
            cols="12"
          >
            <div class="d-flex justify-content-between">
              <div>
                <b-button
                  variant="invisible"
                  class="text-decoration-underline font-weight-normal py-2 px-1 ml-n1"
                  @click="checkAll(true)"
                >
                  {{ $t('cta.selectAll') }}
                </b-button>
                <b-button
                  variant="invisible"
                  class="text-decoration-underline font-weight-normal py-2 px-1"
                  @click="checkAll(false)"
                >
                  {{ $t('cta.deselectAll') }}
                </b-button>
              </div>
              <div class="pt-2">
                {{ textFiltersSelected }}
              </div>
            </div>
          </b-col>
        </b-row>
      </b-form-group>
    </b-form>
    <template slot="modal-cancel">
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.validate") }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';
import PsSelect from '../commons/ps-select';
import SmartShoppingCampaignCreationFilterItem from './smart-shopping-campaign-creation-filter-item.vue';
import {
  filterUncheckedSegments, checkAndUpdateDimensionStatus, deepCheckDimension, countFinalFilters,
} from '../../utils/SSCFilters';

export default {
  name: 'SmartShoppingCampaignCreationFilterPopin',
  components: {
    PsModal,
    PsSelect,
    SmartShoppingCampaignCreationFilterItem,
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
      const final = [];
      return countFinalFilters(this.filteredDimensions, final);
    },

  },

  methods: {
    checkAll(status) {
      deepCheckDimension(this.availableFilters, status);
      checkAndUpdateDimensionStatus(this.availableFilters);
    },

    selectCheckbox(event) {
      deepCheckDimension(event.item, event.checked);
      checkAndUpdateDimensionStatus(this.availableFilters);
    },

    sendDimensionsSelected() {
      this.$emit('selectFilters', this.filteredDimensions);
    },
    selectDimension(dimension) {
      this.dimensionChosen = dimension;
    },
    searchDimension(event) {
      this.searchString = event;
    },
    highlightSearch(str) {
      /** Highlight search terms */
      const regex = new RegExp(`(${this.searchString})`, 'gi');
      return str.replace(regex, '<strong>$1</strong>');
    },
  },
  mounted() {
    this.$root.$on('filterSelected', this.selectCheckbox);
  },

};
</script>
