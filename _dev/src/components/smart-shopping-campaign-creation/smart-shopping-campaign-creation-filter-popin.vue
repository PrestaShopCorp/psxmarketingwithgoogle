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
        id: "allFilters",
        children: [
          {
            checked: false,
            id: "1",
            name: "Animaux et articles pour animaux de compagnie",
            children: [
              {
                checked: false,
                id: "100156408",
                name: "Croquettes pour chats",
                children: [
                  {
                    checked: false,
                    id: "1001568",
                    name: "Chiot"
                  },
                  {
                    checked: false,
                    id: "454065126579",
                    name: "Diabétique"
                  },
                ]
              },
              {
                checked: false,
                id: "126579",
                name: "Croquettes pour rongeurs et lapins"
              },
            ]
          },
          {
            checked: false,
            id: "8",
            name: "Arts et loisirs"
          },
          {
            checked: false,
            id: "111",
            name: "Entreprise et industrie"
          },
          {
            checked: false,
            id: "141",
            name: "Appareils photo, caméras et instruments d'optique"
          },
          {
            checked: false,
            id: "166",
            name: "Vêtements et accessoires"
          },
          {
            checked: false,
            id: "222",
            name: "Appareils électroniques"
          },
          {
            checked: false,
            id: "412",
            name: "Alimentation, boissons et tabac"
          },
          {
            checked: false,
            id: "436",
            name: "Meubles"
          },
          {
            checked: false,
            id: "469",
            name: "Santé et beauté"
          },
          {
            checked: false,
            id: "536",
            name: "Maison et jardin"
          },
          {
            checked: false,
            id: "537",
            name: "Bébés et tout-petits"
          },
          {
            checked: false,
            id: "632",
            name: "Quincaillerie"
          },
          {
            checked: false,
            id: "772",
            name: "Adulte"
          },
          {
            checked: false,
            id: "783",
            name: "Médias"
          },
          {
            checked: false,
            id: "888",
            name: "Véhicules et accessoires"
          },
          {
            checked: false,
            id: "922",
            name: "Fournitures de bureau"
          },
          {
            checked: false,
            id: "988",
            name: "Équipements sportifs"
          },
          {
            checked: false,
            id: "1239",
            name: "Jeux et jouets"
          },
          {
            checked: false,
            id: "2092",
            name: "Logiciels"
          },
          {
            checked: false,
            id: "5181",
            name: "Bagages et maroquinerie"
          },
          {
            checked: false,
            id: "5605",
            name: "Offices religieux et cérémonies"
          }
        ]
      };
    },
    // TODO Getting datas
    // TODO Adding translation
    filteredFilters() {

      let filter = function(array, fn) {
        return array.reduce((r, o) => {
          var children = filter(o.children || [], fn);
          if (fn(o) || children.length) r.push(Object.assign({}, o, children.length && { children }));
          return r;
        }, []);
      }

      return {
        name: 'All filters',
        id: 'allFilters',
        checked: false,
        children: filter(this.selectedFilters.children, ({ checked }) => checked === true)
        // children: this.selectedFilters.children.filter(item => item.checked === true || item.checked === null)
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
      const checkChildren = function(arr) {
        arr.forEach(child => {
          child.checked = event.checked;

          if (child.children) {
            checkChildren(child.children)
          }
          else return
        })
      }

      if (event.id === 'allFilters') {
        this.checked = event.checked;
        checkChildren(this.selectedFilters.children)
      };

      const checkChildren2 = function(arr) {
        arr.forEach(element => {
          if (element.id === event.id) {
            element.checked = event.checked
            if (!element.children) {
              return
            }
            else {
              checkChildren(element.children)
            }
          }
          else {
            if (!element.children) {
              return
            }
            else {
              checkChildren2(element.children)
            }
          }
        });

      }
      this.selectedFilters.children.forEach(element => {
        if (element.id === event.id) {
          element.checked = event.checked
          if (!element.children) {
            return
          }
          else {
            checkChildren(element.children)
          }
        } else {
          if (!element.children) {
            return
          }
          else {
            checkChildren2(element.children)
          }
        }
      });

      this.selectedFilters.children.forEach(element => {
        if (element.id === event.id) {
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
