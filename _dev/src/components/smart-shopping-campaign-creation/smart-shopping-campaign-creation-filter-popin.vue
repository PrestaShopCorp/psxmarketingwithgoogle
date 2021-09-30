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
                :item="filteredFilters"
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
  /**
   * TODO:
   * Handle all events:  close, click on cancel, click on ok, etc...
   */

  name: 'SmartShoppingCampaignCreationFilterPopin',
  components: {
    PsModal,
    SmartShoppingCampaignCreationFilterItem,
  },
  data() {
    return {
      // TODO see if this is the correct way to store selected filters
      dimensionsSelected: [
        'biddingCategory',
        'brands,',
      ],
      valuesSelected: [
        'Adidas',
        'Reebok',
        'Tutu',
        'Tartiflette',
      ],
      selectedFilters: {},
    };
  },
  computed: {
    textFiltersSelected() {
      const textDimensionsSelected = this.$i18n.tc('smartShoppingCampaignCreation.nbDimensionSelected',
        this.dimensionsSelected.length,
        [this.dimensionsSelected.length]);
      const textValuesSelected = this.$i18n.tc('smartShoppingCampaignCreation.nbValuesSelected',
        this.valuesSelected.length,
        [this.valuesSelected.length]);
      return `${textDimensionsSelected} - ${textValuesSelected}`;
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
    filteredFilters() {
      return {
        name: 'All filters',
        id: 'allFilters',
        checked: false,
        children: this.selectedFilters.children.filter(
          (item) => item.checked === true || item.checked === null),
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
    selectCheckbox(event) {
      const checkChildren = function (arr) {
        arr.forEach((child) => {
          child.checked = event.checked;
          if (child.children) {
            checkChildren(child.children);
          }
        });
      };
      if (event.id === 'allFilters') {
        console.log('event', event);
        this.checked = event.checked;
        checkChildren(this.selectedFilters.children);
      }
      this.selectedFilters.children.forEach((element) => {
        if (element.id === event.id) {
          element.checked = event.checked;
          if (!element.children) {
            console.log('hey');
          } else {
            checkChildren(element.children);
          }
        }
      });
      this.selectedFilters.children.forEach((element) => {
        if (element.id === event.id) {
          element.checked = event.checked;
        }
      });
      const isIndeterminate = [];
      this.selectedFilters.children.forEach((element) => {
        isIndeterminate.push(element.checked);
      });
      const newarr = isIndeterminate.filter((x, y) => isIndeterminate.indexOf(x) === y);
      if (newarr.length === 2) this.selectedFilters.indeterminate = true;
      else {
        this.selectedFilters.indeterminate = false;
      }
    },
    sendDimensionsSelected() {
      this.$emit('selectFilters', this.selectedFilters.children);
    },
  },
  beforeMount() {
    this.selectedFilters = this.availableFilters;
  },
  mounted() {
    console.log('hhhhh');
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
    this.$root.$on('tutu', this.selectCheckbox);
  },
};
</script>
