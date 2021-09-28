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
            <ul class="ps_gs-filters">
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
                @removeDimension="deleteItem"
                :item="selectedFilters"
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
      availableFilters: {
        name: 'All filters',
        children: [
          {
            name: 'Bidding category',
            children: [],
          },
        ],
      },
      dimensionsSelected: [
      ],
      valuesSelected: [
      ],
      selectedFilters: {
        name: 'All filters',
        children: [
          {
            name: 'Bidding category',
            children: [],
          },
        ],
      },
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
  },
  methods: {
    selectAll() {
      // TODO: handle select all
    },
    deleteItem(item) {
      // find index and remove element in children array
      const filter = this.selectedFilters.children.find((el) => el.name === 'Bidding category');
      const findIndex = filter.children.findIndex((el) => el.localizedName === item.localizedName);
      filter.children.splice(findIndex, 1);
    },
    getDimensionsChoosen(payload) {
      // find the main category
      const filter = this.selectedFilters.children.find((el) => el.name === 'Bidding category');
      // check if checkbox is checked
      if (payload.state === false) {
        this.deleteItem(payload.value);
      } else {
        filter.children.push({
          name: payload.value.localizedName,
          ...payload.value,
        });
      }
    },
    deselectAll() {
      // TODO: handle deselect all
    },
  },
  mounted() {
    this.$store.dispatch('smartShoppingCampaigns/GET_DIMENSIONS_FILTERS').then((res) => {
      res.categories.forEach((element) => {
        if (element.resourceName.search('BinddingCategory')) {
          const dimensions = this.availableFilters.children.find((el) => el.name === 'Bidding category');
          dimensions.children.push({
            name: element.localizedName,
            ...element,
          });
        }
      });
    });
    this.$root.$on('removeDimension', ((el) => this.deleteItem(el)));
    this.$root.$on('dimensionClicked', ((el) => this.getDimensionsChoosen(el)));
  },
};
</script>
