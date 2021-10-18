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
                <!-- {{ textFiltersSelected }} -->
              </div>
            </div>
          </b-col>
        </b-row>
      </b-form-group>
    </b-form>{{ filteredDimensions }}
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
      availableFilters: {
        name: 'All filters',
        id: 'allFilters',
        checked: false,
        indeterminate: false,
        children: [
          {
            name: 'category1',
            id: 'category1',
            children: [],
            checked: false,
            indeterminate: false,
          },
        ],
      },

    };
  },
  computed: {
    // totalNumberOfProducts() {
    //   const final = [];
    //   this.filteredDimensions.children.forEach((dim) => {
    //     dim.children.forEach((value) => {
    //       final.push(value);
    //     });
    //   });
    //   return final.length;
    // },
    // textFiltersSelected() {
    //   return this.$i18n.tc('smartShoppingCampaignCreation.nbValuesSelected',
    //     this.totalNumberOfProducts,
    //     [this.totalNumberOfProducts]);
    // },

    filteredDimensions() {
      return {
        name: 'All filters',
        id: 'allFilters',
        checked: false,
        indeterminate: false,
        children: [
          {
            name: 'category1',
            id: 'category1',
            children: this.availableFilters.children[0]
              .children.filter((item) => item.checked === true),
            checked: false,
            indeterminate: false,
          },
        ],
      };
    },
  },
  watch: {
    availableFilters(newFilters, oldFilters) {
      console.log('tas bougé', newFilters, oldFilters);
    },
  },
  methods: {
    selectAll() {
      // this.selectedFilters.checked = true;
      // this.selectedFilters.indeterminate = false;
      // this.selectedFilters.children.forEach((element) => {
      //   element.checked = true;
      // });
    },
    deselectAll() {
      // this.selectedFilters.checked = false;
      // this.selectedFilters.indeterminate = false;
      // this.selectedFilters.children.forEach((element) => {
      //   element.checked = false;
      // });
    },
    checkChildren(arr, checkboxClicked) {
      arr.forEach((child) => {
        child.checked = checkboxClicked;
        if (child.children) {
          this.checkChildren(child.children, checkboxClicked);
        }
      });
    },
    checkForIndeterminate(arr) {
      if (arr.children) {
        const isIndeterminate = arr.children.map((element) => element.checked);
        if (isIndeterminate.includes(true) && isIndeterminate.includes(false)) {
          arr.indeterminate = true;
        } else {
          arr.indeterminate = false;
        }
      }
    },

    findCheckboxChecked(obj, event) {
      if (event.item.id === 'allFilters') {
        this.checkChildren(obj.children, event.checked);
      } else if (event.item.children) {
        for (let i = 0; i < obj.children.length; i += 1) {
          const result = obj.children.find((e) => e.id === event.item.id);
          if (result) {
            this.checkChildren(result.children, event.checked);
          }
        }
      }
    },
    selectCheckbox(event) {
      console.log('deselect', event);
      this.findCheckboxChecked(this.selectedFilters, event);
      // this.checkForIndeterminate(this.selectedFilters);
      event.item.checked = !event.item.checked;
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
        // TODO : when API send all dimensions, get rid of the [0]
        this.availableFilters.children[0].children.push({
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
