<template>
  <div>
    <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
      {{ $t('productFeedSettings.export.synchronizationSchedule') }}
    </h3>
    <p>
      <span class="mr-3">
        {{ syncFrequency }}
      </span>
      <span class="mr-3">
        {{ syncTime }}
      </span>
    </p>
    <div class="d-flex flex-column align-items-center p-3 border mt-4">
      <div class="d-flex flex-wrap flex-sm-nowrap align-items-center mb-3">
        <span
          class="font-weight-600 mr-2 order-2 order-sm-0"
        >
          {{ $t('productFeedSettings.export.teaser.title') }}
        </span>
        <b-badge
          class="ml-auto mb-1 ml-sm-0 mb-sm-0"
          variant="primary"
        >
          {{ $t('productFeedSettings.export.teaser.badge') }}
        </b-badge>
      </div>
      <ul class="pl-0 mb-0">
        <li class="d-flex align-items-center mb-3">
          <i class="material-icons mr-2">
            schedule
          </i>
          <span class="ps_gs-fz-12">
            {{ $t('productFeedSettings.export.teaser.syncScheduleCustomization') }}
          </span>
        </li>
        <li class="d-flex align-items-center mb-3">
          <i class="material-icons mr-2">
            autorenew
          </i>
          <span class="ps_gs-fz-12">
            {{ $t('productFeedSettings.export.teaser.exportOption') }}
          </span>
        </li>
        <li class="d-flex align-items-center mb-0">
          <i class="material-icons mr-2">
            toggle_off
          </i>
          <span class="ps_gs-fz-12">
            {{ $t('productFeedSettings.export.teaser.specificProductExclusion') }}
          </span>
        </li>
      </ul>
    </div>
    <div class="d-md-flex text-center justify-content-end mt-3 pt-2">
      <b-button
        @click="cancel"
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        @click="nextStep"
        size="sm"
        :disabled="disableContinue"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.continue") }}
      </b-button>
    </div>
    <settings-footer />
  </div>
  <!-- This is not in batch 1 -->
  <!--
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.export.synchronizationSchedule')"
      label-class="ps_gs-fz-16 font-weight-600 mb-2 p-0 d-block bg-transparent border-0"
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
        {{ $t("cta.understandAndContinue") }}
      </b-button>
    </div>
    <div
      class="text-muted ps_gs-fz-12 mb-0 mt-2
      d-flex align-items-start align-items-sm-center justify-content-end"
    >
      <b-button
        v-b-tooltip
        title="Tooltip!"
        variant="invisible"
        class="d-flex mr-1 text-muted p-0 border-0"
      >
        <span class="material-icons ps_gs-fz-14">
          help_outline
        </span>
      </b-button>
      <p>
        {{ $t("productFeedSettings.noticeDataStored") }}
      </p>
    </div>
  </b-form> -->
</template>

<script>
/**
 * ! Not needed for batch 1
 */
// import timezones from 'timezones.json';
// import {Products} from '@/../fixtures/products.js';
// import PsSelect from '../commons/ps-select';
// import ProductFeedSettingsExportExcludeCategory from
// './product-feed-settings-export-exclude-category';
// import ProductFeedSettingsExportExcludeBrand from './product-feed-settings-export-exclude-brand';

/**
 ** Import fixture of products.
 ** Should be fetched from PrestaShop data
 * TODO: Replace with real datas.
 */
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';

export default {
  name: 'ProductFeedSettingsExport',
  /**
   * ! Not needed for batch 1
   */
  // components: {
  //   PsSelect,
  //   ProductFeedSettingsExportExcludeCategory,
  //   ProductFeedSettingsExportExcludeBrand,
  // },
  // data() {
  //   return {
  //     exportMethods: [
  //       {
  //         text: this.$i18n.t('productFeedSettings.export.allProducts'),
  //         value: 'all',
  //       },
  //       {
  //         text: this.$i18n.t('productFeedSettings.export.byBrand'),
  //         value: 'category',
  //       },
  //       {
  //         text: this.$i18n.t('productFeedSettings.export.byCategory'),
  //         value: 'brand',
  //       },
  //     ],
  //     selectedSyncTime: 0,
  //     selectedTimeZone: 0,
  //     selectedExportMethod: 'all',
  //     selectedExcludeProducts: [],
  //     searchString: '',
  //     allCategoriesIndeterminate: true,
  //     options: Products,
  //   };
  // },
  // methods: {
  //   getTimeRanges(interval, language = window.navigator.language) {
  //     const ranges = [];
  //     const date = new Date();
  //     const format = {
  //       hour: 'numeric',
  //       minute: 'numeric',
  //     };
  //     for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
  //       date.setHours(0);
  //       date.setMinutes(minutes);
  //       ranges.push(date.toLocaleTimeString(language, format));
  //     }
  //     return ranges;
  //   },
  //   pushSelectedExcludeProducts(event) {
  //     this.selectedExcludeProducts = event;
  //   },
  //   searchProducts(event) {
  //     this.searchString = event;
  //   },
  //   highlightSearch(str) {
  //     /** Highlight search terms */
  //     const regex = new RegExp(`(${this.searchString})`, 'gi');
  //     return str.replace(regex, '<strong>$1</strong>');
  //   },
  // },
  data() {
    return {
      syncFrequency: this.$i18n.t('productFeedSettings.export.frequency.daily'),
    };
  },
  components: {
    SettingsFooter,
  },
  computed: {
    disableContinue() {
      /**
       * ! Some validation will be necessary in batch 2
       */
      return false;
    },
    syncTime() {
      return this.$options.filters.timeConverterToHour(this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'].nextJobAt);
    },
  },

  methods: {
    nextStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
  /**
   * ! Not needed for batch 1
   */
  // timezones,
};
</script>
