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
                  @click="selectAll"
                >
                  {{ $t('cta.selectAll') }}
                </b-button>
                <b-button
                  variant="invisible"
                  class="text-decoration-underline font-weight-normal py-2 px-1"
                  @click="deselectAll"
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

export default {
  name: 'SmartShoppingCampaignCreationFilterPopin',
  components: {
    PsModal,
    SmartShoppingCampaignCreationFilterItem,
  },
  data() {
    return {
      selectedFilters: {},
    };
  },
  computed: {
    textFiltersSelected() {
      // TODO We only have 1 dimension for now but need refacto for the text when more
      const textValuesSelected = this.$i18n.tc('smartShoppingCampaignCreation.nbValuesSelected',
        this.filteredDimensions.children.length,
        [this.filteredDimensions.children.length]);
      return `${textValuesSelected}`;
    },
    availableFilters() {
      return {
        name: 'All filters',
        checked: null,
        indeterminate: false,
        id: 'allFilters',
        children: [],
      };
    },
    filteredDimensions() {
      return {
        name: 'All filters',
        id: 'allFilters',
        checked: false,
        children: this.selectedFilters.children.filter((item) => item.checked === true),
      };
    },
  },
  methods: {
    selectAll() {
      this.selectedFilters.checked = true;
      this.selectedFilters.children.forEach((element) => {
        element.checked = true;
      });
      this.selectedFilters.indeterminate = false;
    },
    deselectAll() {
      this.selectedFilters.checked = false;
      this.selectedFilters.children.forEach((element) => {
        element.checked = false;
      });
      this.selectedFilters.indeterminate = false;
    },
    checkChildren(arr, checkboxClicked) {
      arr.forEach((child) => {
        child.checked = checkboxClicked.checked;
      });
    },
    selectCheckbox(event) {
      if (event.id === 'allFilters') {
        this.checked = event.checked;
        this.checkChildren(this.selectedFilters.children, event);
      }
      this.selectedFilters.children.forEach((element) => {
        if (element.id === event.id) {
          element.checked = event.checked;
        }
      });
      const isIndeterminate = this.selectedFilters.children.map((element) => element.checked);
      if (isIndeterminate.includes(true) && isIndeterminate.includes(false)) {
        this.selectedFilters.indeterminate = true;
      } else {
        this.selectedFilters.indeterminate = false;
      }
    },
    sendDimensionsSelected() {
      this.$emit('selectFilters', this.filteredDimensions.children);
    },
  },
  beforeMount() {
    this.selectedFilters = this.availableFilters;
  },
  mounted() {
    this.$store.dispatch('smartShoppingCampaigns/GET_DIMENSIONS_FILTERS').then((res) => {
      res.categories.forEach((element) => {
        this.availableFilters.children.push({
          name: element.localizedName,
          ...element,
          checked: false,
        });
      });
      this.availableFilters.children.sort(
        (a, b) => (a.localizedName > b.localizedName ? 1 : -1),
      );
    });
    this.$root.$on('filterSelected', this.selectCheckbox);
  },
};
</script>
