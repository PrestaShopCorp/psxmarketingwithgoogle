<template>
  <div>
    <b-form-input
      id="campaign-name-input-filter"
      v-model="searchFilterName"
      :placeholder="$t('general.search')"
      size="sm"
      type="text"
      @input="debounceName()"
    />
    <ul
      class="ps_gs-filters"
      v-if="dimensionChosen.children"
    >
      <SmartShoppingCampaignCreationFilterItem
        :is-open-by-default="true"
        v-for="(child, index) in dimensionChosen.children"
        :key="index"
        :item="child"
        :selected-filters="false"
      />
    </ul>
    <div class="d-flex mt-2">
      <b-form-tag
        class="mr-1"
        v-for="(filter, index) in filtersChosen"
        :key="index"
        @remove="removeTag(filter)"
        :title="filter.name"
        placeholder=""
      />
      <b-button
        variant="invisible"
        class="text-decoration-underline font-weight-normal py-2 px-1 justify-content-end"
        @click="checkAll(false)"
      >
        {{ $t('cta.clearAll') }}
      </b-button>
    </div>
    <div class="d-md-flex text-center justify-content-end mt-3 mb-2">
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
        :disabled="!filtersChosen.length"
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
  filterUncheckedSegments, checkAndUpdateDimensionStatus, deepCheckDimension, getFilters,
} from '../../../utils/SSCFilters';

export default {
  name: 'SmartShoppingCampaignCreationPopinFilter',
  components: {
    SmartShoppingCampaignCreationFilterItem,
  },
  props: {
    dimensionChosen: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchFilterName: null,
      timer: null,
    };
  },
  computed: {
    filtersChosen: {
      get() {
        return getFilters(filterUncheckedSegments(this.dimensionChosen), []);
      },
      set() {

      },
    },
  },
  methods: {
    checkAll(status) {
      deepCheckDimension(this.dimensionChosen, status);
      checkAndUpdateDimensionStatus(this.dimensionChosen);
    },
    debounceName() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$root.$emit('filterByName', this.searchFilterName);
      }, 1000);
    },
    selectCheckbox(event) {
      deepCheckDimension(event.item, event.checked);
      checkAndUpdateDimensionStatus(this.dimensionChosen);
    },
    confirmation() {
      this.$emit('validateCreationFilters');
      this.$emit('sendStep', 1);
    },
    goBack() {
      this.$emit('sendStep', 1);
    },
    removeTag(filter) {
      this.selectCheckbox({item: filter, checked: false});
    },
  },
  mounted() {
    this.$root.$on('filterSelected', this.selectCheckbox);
  },

};
</script>
