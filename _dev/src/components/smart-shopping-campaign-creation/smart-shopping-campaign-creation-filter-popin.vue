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

export default {
  name: 'SmartShoppingCampaignCreationFilterPopin',
  components: {
    PsModal,
    SmartShoppingCampaignCreationFilterItem,
  },
  data() {
    return {
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
          {
            name: 'category2',
            id: 'category2',
            children: [],
            checked: false,
            indeterminate: false,
          },
        ],
      },

    };
  },
  computed: {
    totalNumberOfProducts() {
      const final = [];
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
    },
    textFiltersSelected() {
      return this.$i18n.tc('smartShoppingCampaignCreation.nbValuesSelected',
        this.totalNumberOfProducts,
        [this.totalNumberOfProducts]);
    },

    filteredDimensions() {
      return {
        name: 'All filters',
        id: 'allFilters',
        checked: false,
        indeterminate: false,
        children: this.filteredChildren(this.availableFilters),
      };
    },
  },
  watch: {
    filteredDimensions() {
      this.$nextTick(() => {
        this.filteredChildren(this.availableFilters);
      });
    },
  },

  methods: {
    filteredChildren(obj) {
      if (!obj.children) {
        return ;
      }
      const final = [];
      obj.children.forEach((child, index) => {
        if (child.checked) {
          final.push(child);
            final[index] = {
              ...final[index],
              children: [],
            };
          if (child.children) {
            child.children.forEach((child2) => {
              if (child2.checked) {
                final[index].children.push(child2);
              }
            });
          }
        }
      });
      return final;
    },

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

    checkForIndeterminate(obj) {
      const isIndeterminate = obj.children.map((element) => element.checked);
      if (isIndeterminate.includes(true) && isIndeterminate.includes(false)) {
        obj.indeterminate = true;
      } else {
        obj.indeterminate = false;
      }
      obj.children.forEach((child) => {
        if (child.children) {
          this.checkForIndeterminate(child);
        }
      });
    },

    selectCheckbox(event) {
      this.checkChildren(event.item?.children || [], event.checked);
      event.item.checked = event.checked;
      this.checkForIndeterminate(this.availableFilters);
    },

    sendDimensionsSelected() {
      this.$emit('selectFilters', this.filteredDimensions.children);
    },

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
        this.availableFilters.children[1].children.push({
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
