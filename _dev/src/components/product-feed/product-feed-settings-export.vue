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
          v-for="(option, index) in $options.exportMethods"
          :key="index"
          :value="option.value"
        >
          {{ option.text }}
        </b-form-select-option>
      </b-select>
    </b-form-group>
    <b-form-group
      class="mt-4 pb-2"
    >
      <label class="ps_gs-fz-16 font-weight-600 mb-2 p-0 d-block">
        {{ $t("productFeedSettings.export.excludeProducts") }}
      </label>
      <ps-select
        :reduce="options => options.name"
        :options="options.filter(o => selectedExcludeProducts.indexOf(o.name) < 0)"
        :deselect-from-dropdown="true"
        multiple
        @input="pushSelectedExcludeProducts"
        @search="searchProducts"
        label="name"
        :placeholder="$t('productFeedSettings.export.searchProducts')"
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
  </b-form>
</template>

<script>
import timezones from 'timezones.json';
import PsSelect from '../commons/ps-select';

export default {
  name: 'ProductFeedSettingsExport',
  components: {PsSelect},
  data() {
    return {
      selectedSyncTime: 0,
      selectedTimeZone: 0,
      selectedExportMethod: 'all',
      selectedExcludeProducts: [],
      searchString: '',
      options: [
        {
          id: '20',
          name: 'Carte cadeau',
        },
        {
          id: '19',
          name: 'Mug personnalisable',
        },
        {
          id: '18',
          name: 'Carnet de notes Colibri',
        },
        {
          id: '17',
          name: 'Carnet de notes Ours brun',
        },
        {
          id: '16',
          name: 'Carnet de notes Renard',
        },
        {
          id: '15',
          name: 'Pack Mug + Affiche encadrée',
        },
        {
          id: '14',
          name: 'Illustration vectorielle Colibri',
        },
        {
          id: '13',
          name: 'Illustration vectorielle Ours brun',
        },
        {
          id: '12',
          name: 'Illustration vectorielle Renard',
        },
        {
          id: '11',
          name: 'Coussin colibri',
        },
        {
          id: '10',
          name: 'Coussin ours brun',
        },
        {
          id: '9',
          name: 'Coussin renard',
        },
        {
          id: '8',
          name: 'Mug Today is a good day',
        },
        {
          id: '7',
          name: 'Mug The adventure begins',
        },
        {
          id: '6',
          name: 'Mug The best is yet to come',
        },
        {
          id: '5',
          name: 'Affiche encadrée Today is a good day',
        },
        {
          id: '4',
          name: 'Affiche encadrée The adventure begins',
        },
        {
          id: '3',
          name: 'Affiche encadrée The best is yet to come',
        },
        {
          id: '2',
          name: 'Pull imprimé colibri',
        },
        {
          id: '1',
          name: 'T-shirt imprimé colibri',
        },
      ],
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
  mounted() {
  },
  timezones,
  exportMethods: [
    {
      text: 'Export all products',
      value: 'all',
    },
    {
      text: 'Export by category',
      value: 'category',
    },
    {
      text: 'Export by brand',
      value: 'brand',
    },
  ],
};
</script>
