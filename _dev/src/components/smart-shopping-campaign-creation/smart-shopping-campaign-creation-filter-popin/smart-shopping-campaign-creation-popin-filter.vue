<template>
  <div>
    <div class="bg-light px-2 pt-2 pb-1 rounded-top border border-bottom-0 border-450">
      <b-form-input
        id="campaign-name-input-filter"
        v-model="searchFilterName"
        :placeholder="$t('general.search')"
        size="sm"
        type="text"
        @input="debounceName()"
      />
    </div>
    <div
      v-if="loader"
      class="text-muted rounded-bottom border border-450 p-3 text-center"
    >
      <i class="icon-busy icon-busy--dark mr-1" />
      {{ $t('badge.loading') }}
    </div>
    <ul
      class="ps_gs-filters"
      v-if="dimensionChosen.children && !loader"
    >
      <SmartShoppingCampaignCreationFilterItem
        :is-open-by-default="true"
        v-for="(child, index) in dimensionChosen.children"
        :key="index"
        :item="child"
        :selected-filters="false"
      />
    </ul>
    <div class="ps_gs-selected-filters"
      v-if="!loader"
    >
      <div class="d-flex flex-wrap align-items-center mr-2 ps_gs-selected-filters__badges">
        <b-form-tag
          class="mr-1 mb-1"
          v-for="(filter, index) in filtersChosen"
          :key="index"
          @remove="removeTag(filter)"
          :title="filter.name"
        />
      </div>
      <b-button
        variant="outline-secondary"
        size="sm"
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
    loader: {
      type: Boolean,
      required: true,
      default: false,
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
    },
    dimensionChosen() {
      return this.$store.state.smartShoppingCampaigns.dimensionChosen;
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
