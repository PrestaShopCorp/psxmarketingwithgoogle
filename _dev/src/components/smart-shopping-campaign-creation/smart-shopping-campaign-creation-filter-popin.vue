<template>
  <ps-modal
    id="SmartShoppingCampaignCreationFilterPopin"
    ref="modal"
    v-bind="$attrs"
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
            <ul class="ps_gs-filters"
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
    // TODO Getting datas
    // TODO Adding translation
    availableFilters() {
      return {
        name: 'All filters',
        checked: null,
        indeterminate: false,
        children: [
      {
        checked: false,
        name: "Animaux et articles pour animaux de compagnie"
      },
      {
        checked: false,
        name: "Arts et loisirs"
      },
      {
        checked: false,
        name: "Entreprise et industrie"
      },
      {
        checked: false,
        name: "Appareils photo, caméras et instruments d'optique"
      },
      {
        checked: false,
        name: "Vêtements et accessoires"
      },
      {
        checked: false,
        name: "Appareils électroniques"
      },
      {
        checked: false,
        name: "Alimentation, boissons et tabac"
      },
      {
        checked: false,
        name: "Meubles"
      },
      {
        checked: false,
        name: "Santé et beauté"
      },
      {
        checked: false,
        name: "Maison et jardin"
      },
      {
        checked: false,
        name: "Bébés et tout-petits"
      },
      {
        checked: false,
        name: "Quincaillerie"
      },
      {
        checked: false,
        name: "Adulte"
      },
      {
        checked: false,
        name: "Médias"
      },
      {
        checked: false,
        name: "Véhicules et accessoires"
      },
      {
        checked: false,
        name: "Fournitures de bureau"
      },
      {
        checked: false,
        name: "Équipements sportifs"
      },
      {
        checked: false,
        name: "Jeux et jouets"
      },
      {
        checked: false,
        name: "Logiciels"
      },
      {
        checked: false,
        name: "Bagages et maroquinerie"
      },
      {
        checked: false,
        name: "Offices religieux et cérémonies"
      }
        ]
      };
    },
    // TODO Getting datas
    // TODO Adding translation
    filteredFilters() {
      return {
        name: 'All filters',
        checked: false,
        children: this.selectedFilters.children.filter(item => item.checked === true || item.checked === null)
      };
    },
  },
  methods: {
    selectAll() {
      // TODO: handle select all
      this.selectedFilters.checked = true;
      this.selectedFilters.children.forEach(element => {
          element.checked = true;
      });
      this.selectedFilters.indeterminate = false;
    },
    deselectAll() {
      // TODO: handle deselect all
      this.selectedFilters.checked = false;
      this.selectedFilters.children.forEach(element => {
          element.checked = false;
      });
      this.selectedFilters.indeterminate = false;
    },
    selectCheckbox: function(event) {
      if (event.name === 'All filters') {
        this.checked = event.checked;
        this.selectedFilters.children.forEach(element => {
          element.checked = event.checked
        });
      };
      this.selectedFilters.children.forEach(element => {
        if (element.name === event.name) {
          element.checked = event.checked
        }
      });
      let isIndeterminate = [];
      this.selectedFilters.children.forEach(element => {
        isIndeterminate.push(element.checked)
      });
      let newarr = isIndeterminate.filter((x, y) => isIndeterminate.indexOf(x) == y);
      if(newarr.length === 2) this.selectedFilters.indeterminate = true;
      else {
        this.selectedFilters.indeterminate = false
      }
    }
  },
  beforeMount() {
    this.selectedFilters = this.availableFilters
  },
  mounted() {
    this.$root.$on('tutu', this.selectCheckbox)
  },
};
</script>
