<template>
  <ps-modal
    id="SmartShoppingCampaignCreationFilterPopin"
    ref="modal"
    v-bind="$attrs"

    cancel-variant="invisible font-weight-normal"
  >
    <!-- TODO START > Ajout de filtres dynamiques -->
    <b-form>
      <h5 class="ps_gs-fz-16 font-weight-600 mb-1">
        Select products
      </h5>
      <p class="ps_gs-fz-16 mb-4">
        Select the filters you want to add in your Google Ads campaign
      </p>
      <b-form-group>
        <b-row>
          <b-col
            cols="12"
            md="6"
            class="mb-3 mb-md-0"
          >
            <h6 class="ps_gs-fz-16 font-weight-normal">
              Dimension value
            </h6>
            <ul class="ps_gs-filters">
              <SmartShoppingCampaignCreationFilterItem
                :item="$options.treeFilters"
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
              Selected dimension value
            </h6>
            <ul class="ps_gs-filters">
              <SmartShoppingCampaignCreationFilterItem
                :item="$options.treeFilters"
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
                  class="text-decoration-underline py-2 px-1 ml-n1"
                  @click="selectAll"
                >
                  Select all
                </b-button>
                <b-button
                  variant="invisible"
                  class="text-decoration-underline py-2 px-1"
                  @click="deselectAll"
                >
                  Deselect all
                </b-button>
              </div>
              <!-- TODO / need to be dynamic -->
              <div class="pt-2">
                2 dimensions selected - 12 values selected
              </div>
            </div>
          </b-col>
        </b-row>
      </b-form-group>
    </b-form>
    <!-- TODO END > Ajout de filtres dynamiques -->
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
  methods: {
    selectAll() {
      // TODO: handle select all
    },
    deselectAll() {
      // TODO: handle deselect all
    },
  },
  // TODO Getting datas
  // TODO Adding translation
  treeFilters: {
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
  },
};
</script>
