<template>
  <div>
    <b-form-input
      id="campaign-name-input-filter"
      v-model="searchFilterName"
      :placeholder="$t('general.search')"
      size="sm"
      type="text"
      @keyup="debounceName()"
    />

    <ul class="ps_gs-filters">
      <SmartShoppingCampaignCreationFilterItem
        v-if="dimensionChosen"
        :item="dimensionChosen"
        :is-open-by-default="true"
      />
      <div v-else>
        {{ $t('smartShoppingCampaignCreation.selectFilterInfo') }}
      </div>
    </ul>

    {{ $t('smartShoppingCampaignCreation.infos') }}

    <div class="d-flex">
      <b-form-tags
        input-id="tags-separators"
        v-model="filtersChosen"
        separator=" ,;"
        placeholder=""
        tag-variant="info"
      />
      <b-button
        variant="invisible"
        class="text-decoration-underline font-weight-normal py-2 px-1"
        @click="checkAll(false)"
      >
        {{ $t('cta.deselectAll') }}
      </b-button>
      <div class="pt-2">
        {{ textFiltersSelected }}
      </div>
    </div>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
        @click="goBack"
      >
        {{ $t("cta.back") }}
      </b-button>
      <b-button
        size="sm"
        :disabled="dimensionChosen.length >0"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
        @click="confirmation"
      >
        {{ $t("cta.validateSelection") }}
      </b-button>
    </div>
  </div>
</template>

<script>
import SmartShoppingCampaignCreationFilterItem from './smart-shopping-campaign-creation-filter-item.vue';
import {
  filterUncheckedSegments, checkAndUpdateDimensionStatus, deepCheckDimension, getFiltersNames,
} from '../../../utils/SSCFilters';

export default {
  name: 'SmartShoppingCampaignCreationPopinFilter',
  components: {
    SmartShoppingCampaignCreationFilterItem,
  },
  props: {
    availableFilters: {
      type: Object,
      required: true,
    },
    dimensionChosen: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchFilterName: null,
    };
  },
  computed: {
    textFiltersSelected() {
      return this.$i18n.tc('smartShoppingCampaignCreation.nbValuesSelected',
        this.totalNumberOfProducts,
        [this.totalNumberOfProducts]);
    },
    filteredDimensions() {
      return filterUncheckedSegments(this.availableFilters);
    },
    filtersChosen() {
      return getFiltersNames(this.filteredDimensions, []);
    },
    totalNumberOfProducts() {
      return getFiltersNames(this.filteredDimensions, []).length;
    },

  },

  methods: {
    checkAll(status) {
      deepCheckDimension(this.availableFilters, status);
      checkAndUpdateDimensionStatus(this.availableFilters);
    },
    debounceName() {
      this.availableFilters.children.filter((f) => {
        console.log(f.name.toUpperCase());
        console.log(this.searchFilterName.toUpperCase());
      });
    },
    selectCheckbox(event) {
      deepCheckDimension(event.item, event.checked);
      checkAndUpdateDimensionStatus(this.availableFilters);
    },
    confirmation() {
      this.$emit('validateCreationFilters');
    },
    goBack() {
      this.checkAll(false);
      this.$emit('sendStep', 1);
    },
  },
  mounted() {
    this.$root.$on('filterSelected', this.selectCheckbox);
  },

};
</script>
