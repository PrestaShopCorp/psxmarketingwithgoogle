<template>
  <ps-modal
    id="SmartShoppingCampaignCreationFilterPopin"
    ref="modal"
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
            cols="12"
            md="6"
            class="mb-3 mb-md-0"
          >
            <h6 class="ps_gs-fz-16 font-weight-normal">
              {{ $t('smartShoppingCampaignCreation.labelDimensionValue') }}
            </h6>
            <ul
              class="ps_gs-filters"
            >
              <SmartShoppingCampaignCreationFilterItem
                :item="availableFilters"
                :is-open-by-default="true"
              />
            </ul>
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
                :item="filteredDimensions"
                :is-open-by-default="true"
                :selected-filters="true"
              />
            </ul>
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
import SmartShoppingCampaignCreationFilterItem from './smart-shopping-campaign-creation-filter-item.vue';
import {filterUncheckedSegments, checkForIndeterminate} from '../../utils/SSCFilters';

export default {
  name: 'SmartShoppingCampaignCreationFilterPopin',
  components: {
    PsModal,
    SmartShoppingCampaignCreationFilterItem,
  },
  props: {
    availableFilters: {
      type: Object,
      required: true,
    },
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
      if (this.filteredDimensions && this.filteredDimensions.children) {
        this.filteredDimensions.children.forEach((dim) => {
          if (dim.children) {
            dim.children.forEach((value) => {
              final.push(value);
            });
          } else {
            final.push(dim);
          }
        });
        return final.length;
      }
      return 0;
    },

  },

  methods: {
    checkAll(status) {
      this.availableFilters.checked = status;
      this.availableFilters.indeterminate = false;
      if (this.availableFilters.children) {
        this.checkChildren(this.availableFilters.children, status);
      }
    },

    checkChildren(arr, checkboxClicked) {
      arr.forEach((child) => {
        child.checked = checkboxClicked;
        if (child.children) {
          this.checkChildren(child.children, checkboxClicked);
        }
      });
    },

    selectCheckbox(event) {
      this.checkChildren(event.item?.children || [], event.checked);
      event.item.checked = event.checked;
      checkForIndeterminate(this.availableFilters);
    },

    sendDimensionsSelected() {
      this.$emit('selectFilters', this.filteredDimensions);
    },
  },
  mounted() {
    this.$root.$on('filterSelected', this.selectCheckbox);
  },
};
</script>
