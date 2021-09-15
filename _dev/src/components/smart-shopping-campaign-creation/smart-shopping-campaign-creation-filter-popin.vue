<template>
  <ps-modal
    id="SmartShoppingCampaignCreationFilterPopin"
    ref="modal"
    v-bind="$attrs"
    cancel-variant="invisible font-weight-normal"
  >
    <b-form>
      <h5 class="ps_gs-fz-16 font-weight-600 mb-1">
        {{ $t('smartShoppingCampaignCreation.selectProductsTitle') }}
      </h5>
      <p class="ps_gs-fz-16 mb-4">
        {{ $t('smartShoppingCampaignCreation.selectProductsSubtitle') }}
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
      // TODO see if this is the correct way to store selected filters
      dimensionsSelected: [
        'biddingCategory',
        'brands,'
      ],
      valuesSelected: [
        'Adidas',
        'Reebok',
        'Tutu',
        'Tartiflette',
      ],
    };
  },
  computed: {
    textFiltersSelected() {
      let textDimensionsSelected =
        this.$i18n.tc('smartShoppingCampaignCreation.nbDimensionSelected',
        this.dimensionsSelected.length,
        [this.dimensionsSelected.length])
      let textValuesSelected =
        this.$i18n.tc('smartShoppingCampaignCreation.nbValuesSelected',
        this.valuesSelected.length,
        [this.valuesSelected.length])
      return `${textDimensionsSelected} - ${textValuesSelected}`
    },
    // TODO Getting datas
    // TODO Adding translation
    availableFilters() {
      return {
        name: 'All filters',
        children: [
          {
            name: 'Bidding category',
          },
          {
            name: 'Canonical condition',
            children: [
              {
                name: 'NEW',
              },
              {
                name: 'USED',
              },
              {
                name: 'REFURBISHED',
              },
              {
                name: 'UNKNOWN',
              },
            ],
          },
          {
            name: 'Brands',
            children: [
              {
                name: 'Nike',
                children: [
                  {
                    name: 'tutu',
                  },
                  {
                    name: 'tata',
                  },
                ],
              },
              {
                name: 'Reebok',
              },
              {
                name: 'Jouet Club',
                children: [
                  {
                    name: 'Hasbro',
                  },
                  {
                    name: 'Mattel',
                  },
                  {
                    name: 'Kenner',
                  },
                  {
                    name: 'Poly pocket',
                  },
                ],
              },
            ],
          },
          {
            name: 'Custom attribute',
          },
          {
            name: 'Offer ID',
          },
          {
            name: 'Product type',
          },
        ],
      };
    },
    // TODO Getting datas
    // TODO Adding translation
    selectedFilters() {
      return {
        name: 'All filters',
        children: [
          {
            name: 'Canonical condition',
            children: [
              {
                name: 'NEW',
              },
            ],
          },
          {
            name: 'Brands',
            children: [
              {
                name: 'Nike',
                children: [
                  {
                    name: 'tutu',
                  },
                  {
                    name: 'tata',
                  },
                ],
              },
              {
                name: 'Reebok',
              },
            ],
          },
        ],
      };
    },
  },
  methods: {
    selectAll() {
      // TODO: handle select all
    },
    deselectAll() {
      // TODO: handle deselect all
    },
  },
};
</script>
