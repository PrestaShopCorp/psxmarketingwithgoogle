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
        checked: false,
        children: [
        ],
      },
      dimensionsSelected: [
      ],
      selectedFilters: {
        name: 'All filters',
        children: [
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
        this.selectedFilters.children.length,
        [this.selectedFilters.children.length]);
      return `${textDimensionsSelected} - ${textValuesSelected}`;
    },
    // TODO Getting datas
    // TODO Adding translation
  },
  methods: {
    selectAll() {
      this.availableFilters.checked = true;
      this.availableFilters.children.forEach((el) => {
        el.checked = true;
      });
      this.selectedFilters.children = [...this.availableFilters.children];
    },
    deleteItem(item) {
      if (item.children) {
        this.deselectAll();
      } else {
        const filters = this.selectedFilters.children;
        const searchCtg = filters.findIndex((el) => el.localizedName === item.localizedName);
        if (searchCtg !== -1) {
          this.uncheckCategory(item);
          filters.splice(searchCtg, 1);
        }
      }
    },
    getDimensionsChoosen(payload) {
      if (payload.value.children) {
        if (payload.state === false) {
          this.deselectAll();
        } else {
          this.selectAll();
        }
      } else {
        if (payload.state === false) {
          this.deleteItem(payload.value);
        } else {
          this.selectOne(payload.value);
        }

      }
    },
    deselectAll() {
      this.availableFilters.checked = false;
      this.availableFilters.children.forEach((item) => {
        item.checked = false;
      });
      this.selectedFilters.children = [];
    },
    uncheckCategory(ctg) {
      this.availableFilters.children.find((el) => {
        if (ctg.localizedName === el.localizedName) {
          el.checked = false;
        }
      });
    },
    selectOne(ctg) {
      const findCtg = this.selectedFilters.children.find((el) => el.localizedName === ctg.localizedName);
      if (!findCtg) {
        this.selectedFilters.children.push({
          name: ctg.localizedName,
          ...ctg,
        });
        this.selectedFilters.children.sort((a, b) => a.localizedName > b.localizedName && 1 || -1);
      }
    },
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
      this.availableFilters.children.sort((a, b) => a.localizedName > b.localizedName && 1 || -1);
    });
    this.$root.$on('removeDimension', ((el) => this.deleteItem(el)));
    this.$root.$on('dimensionClicked', ((el) => this.getDimensionsChoosen(el)));
  },
};
</script>
