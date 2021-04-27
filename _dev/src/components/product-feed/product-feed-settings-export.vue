<template>
  <b-form>
    <b-form-group
      :label="$t('productFeedSettings.export.synchronizationSchedule')"
      label-class="h4 font-weight-600 mb-2 d-block p-0"
    >
      <b-form-row>
        <b-col md="3">
          <label class="mb-2">
            {{ $t("productFeedSettings.export.synchronizationTime") }}
          </label>
          <b-select v-model="selectedSyncTime" class="mb-3 mb-md-0">
            <b-form-select-option :value="null">
              Please select an option
            </b-form-select-option>
            <b-form-select-option
              v-for="(option, index) in getTimeRanges(30)"
              :key="index"
              :value="index"
            >
              {{ option }}
            </b-form-select-option>
          </b-select>
        </b-col>
        <b-col md="8">
          <label class="mb-2">
            {{ $t("productFeedSettings.export.timeZone") }}
          </label>
          <b-select v-model="selectedTimeZone" class="mb-3 mb-md-0">
            <b-form-select-option :value="null">
              Please select an option
            </b-form-select-option>
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
    <b-form-group
      class="mt-4"
    >
    <label class="mb-2">
      Exclude products
    </label>
      <v-select
        :components="{ Deselect }"
        :reduce="options => options.name"
        :options="options.filter(o => selectedExcludeProducts.indexOf(o.name) < 0)"
        :deselect-from-dropdown="true"
        class="ps_gs-v-select"
        multiple
        @input="pushSelectedExcludeProducts"
        @search="searchProducts"
        label="name"
        placeholder="Search product"
      >
        <template v-slot:option="option">
          {{ option.id }} - <span v-html="highlightSearch(option.name)" />
        </template>
      </v-select>
    </b-form-group>
    <b-form-group class="mt-4">
      <label class="h4 font-weight-600 mb-2 d-block p-0">
        {{ $t("productFeedSettings.export.exportMethod") }}
      </label>
      <b-select v-model="selectedExportMethod" class="mb-3 mb-md-0 col-md-9">
        <b-form-select-option
          v-for="(option, index) in $options.exportMethods"
          :key="index"
          :value="option.value"
        >
          {{ option.text }}
        </b-form-select-option>
      </b-select>
    </b-form-group>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button class="mx-2 mt-3 mt-md-0" variant="outline-secondary">
        {{ $t("cta.back") }}
      </b-button>
      <b-button class="mx-2 mt-3 mt-md-0" variant="outline-secondary">
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        :disabled="disableContinue"
        class="mx-2 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.continue") }}
      </b-button>
    </div>
  </b-form>
</template>

<script>
import vSelect from 'vue-select';
import timezones from "timezones.json";

export default {
  name: "ProductFeedSettingsExport",
  components: { vSelect, },
  data() {
    return {
      selectedSyncTime: null,
      selectedTimeZone: null,
      selectedExportMethod: 'all',
      selectedExcludeProducts: [],
      searchString: '',
      options: [
        { name: 'Orange', id: '1598735' },
        { name: 'Apple', id: '1497935' },
        { name: 'Pineapple', id: '22474135' },
        { name: 'Grape', id: '177135' },
      ],
      Deselect: {
        render: createElement => createElement('span', {class: 'material-icons ps_gs-v-select__deselect'}, 'close'),
      },
    };
  },
  methods: {
    getTimeRanges(interval, language = window.navigator.language) {
      const ranges = [];
      const date = new Date();
      const format = {
        hour: "numeric",
        minute: "numeric",
      };
      for (let minutes = 0; minutes < 24 * 60; minutes = minutes + interval) {
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
      const regex = new RegExp(`(${this.searchString})`, 'gi');
      return str.replace(regex, '<strong>$1</strong>');
    },
  },
  computed: {
    disableContinue() {
      return true;
    },
  },
  mounted() {
  },
  timezones,
  exportMethods: [
    {
      text: "Export all products",
      value: "all",
    },
    {
      text: "Export by category",
      value: "category",
    },
    {
      text: "Export by brand",
      value: "brand",
    },
  ],
};
</script>
