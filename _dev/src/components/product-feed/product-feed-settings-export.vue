<template>
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.export.synchronizationSchedule')"
      label-class="ps_gs-fz-16 font-weight-600 mb-2 p-0 d-block"
    >
      <b-form-row>
        <b-col
          cols="12"
          class="maxw-sm-160"
        >
          <label class="mb-2">
            {{ $t("productFeedSettings.export.synchronizationTime") }}
          </label>
          <b-select
            v-model="selectedSyncTime"
            class="mb-3 mb-md-0"
          >
            <b-form-select-option
              v-for="(option, index) in getTimeRanges(30)"
              :key="index"
              :value="index"
            >
              {{ option }}
            </b-form-select-option>
          </b-select>
        </b-col>
        <b-col
          cols="12"
          class="maxw-sm-420"
        >
          <label class="mb-2">
            {{ $t("productFeedSettings.export.timeZone") }}
          </label>
          <b-select
            v-model="selectedTimeZone"
            class="mb-3 mb-md-0"
          >
            <b-form-select-option
              v-for="(option, index) in $options.timezones"
              :key="index"
              :value="option.offset"
            >
              {{ option.text }}
            </b-form-select-option>
          </b-select>
        </b-col>
      </b-form-row>
    </b-form-group>
    <b-form-group class="mt-4">
      <label class="ps_gs-fz-16 font-weight-600 mb-2 p-0 d-block">
        {{ $t("productFeedSettings.export.exportMethod") }}
      </label>
      <b-select
        v-model="selectedExportMethod"
        class="maxw-sm-500 mb-3 mb-md-0 col-md-9"
      >
        <b-form-select-option
          v-for="(option, index) in exportMethods"
          :key="index"
          :value="option.value"
        >
          {{ option.text }}
        </b-form-select-option>
      </b-select>
    </b-form-group>
    <product-feed-settings-export-exclude-category
      v-if="selectedExportMethod == 'category'"
    />
    <product-feed-settings-export-exclude-brand
      v-if="selectedExportMethod == 'brand'"
    />
    <b-form-group
      class="mt-4 pb-2"
    >
    <label class="ps_gs-fz-16 font-weight-600 mb-2 p-0 d-block">
      {{ $t("productFeedSettings.export.labelExcludeProducts") }}
    </label>
      <ps-select
        :reduce="options => options.name"
        :options="options.filter(o => selectedExcludeProducts.indexOf(o.name) < 0)"
        :deselect-from-dropdown="true"
        multiple
        @input="pushSelectedExcludeProducts"
        @search="searchProducts"
        label="name"
        :placeholder="$t('productFeedSettings.export.placeholderExcludeProducts')"
        class="maxw-sm-500"
        :class="{ 'has-selection': selectedExcludeProducts.length > 0 }"
      >
        <template v-slot:option="option">
          <span v-html="highlightSearch(`${option.id} - ${option.name}`)" />
        </template>
      </ps-select>
    </b-form-group>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.back") }}
      </b-button>
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        size="sm"
        :disabled="disableContinue"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.continue") }}
      </b-button>
    </div>
    <div class="text-muted ps_gs-fz-12 mb-0 mt-2 d-flex align-items-start align-items-sm-center justify-content-end">
      <b-button
        v-b-tooltip
        title="Tooltip!"
        variant="invisible"
        class="mr-1 text-muted p-0 border-0"
      >
        <b-icon-exclamation-circle />
        <span class="sr-only">Tooltip!</span>
      </b-button>
      <p>
        {{ $t("productFeedSettings.noticeDataStored") }}
      </p>
    </div>
  </b-form>
</template>

<script>
import timezones from 'timezones.json';
import PsSelect from '../commons/ps-select';
import {
  BIconExclamationCircle,
} from 'bootstrap-vue';
import ProductFeedSettingsExportExcludeCategory from './product-feed-settings-export-exclude-category';
import ProductFeedSettingsExportExcludeBrand from './product-feed-settings-export-exclude-brand';
/**
 ** Import fixture of products.
 ** Should be fetched from PrestaShop data
 * TODO: Replace with real datas.
 */
import { Products } from '@/../fixtures/products.js'
export default {
  name: 'ProductFeedSettingsExport',
  components: {
    PsSelect,
    BIconExclamationCircle,
    ProductFeedSettingsExportExcludeCategory,
    ProductFeedSettingsExportExcludeBrand,
  },
  data() {
    return {
      exportMethods: [
        {
          text: this.$i18n.t('productFeedSettings.export.allProducts'),
          value: 'all',
        },
        {
          text: this.$i18n.t('productFeedSettings.export.byBrand'),
          value: 'category',
        },
        {
          text: this.$i18n.t('productFeedSettings.export.byCategory'),
          value: 'brand',
        },
      ],
      selectedSyncTime: 0,
      selectedTimeZone: 0,
      selectedExportMethod: 'all',
      selectedExcludeProducts: [],
      searchString: '',
      allCategoriesIndeterminate: true,
      options: Products,
    };
  },
  methods: {
    getTimeRanges(interval, language = window.navigator.language) {
      const ranges = [];
      const date = new Date();
      const format = {
        hour: 'numeric',
        minute: 'numeric',
      };
      for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
        date.setHours(0);
        date.setMinutes(minutes);
        ranges.push(date.toLocaleTimeString(language, format));
      }
      return ranges;
    },
    pushSelectedExcludeProducts(event) {
      this.selectedExcludeProducts = event;
    },
    searchProducts(event) {
      this.searchString = event;
    },
    highlightSearch(str) {
      /** Highlight search terms */
      const regex = new RegExp(`(${this.searchString})`, 'gi');
      return str.replace(regex, '<strong>$1</strong>');
    },
  },
  computed: {
    disableContinue() {
      return true;
    },
  },
  timezones,
};
</script>
