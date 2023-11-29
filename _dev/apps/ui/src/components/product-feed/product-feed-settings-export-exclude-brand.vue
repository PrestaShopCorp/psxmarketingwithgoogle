<template>
  <b-form-group
    class="mt-0 pb-2"
  >
    <label class="ps_gs-fz-14 font-weight-600 mb-2 p-0 d-block">
      {{ $t('productFeedSettings.export.labelSelectBrand') }}
    </label>
    <ps-select
      :reduce="options => options.name"
      :options="options.filter(o => selectedBrand.indexOf(o.name) < 0)"
      :deselect-from-dropdown="true"
      multiple
      @input="pushSelectedBrands"
      @search="searchProducts"
      label="name"
      :placeholder="$t('productFeedSettings.export.placeholderSelectBrand')"
      class="maxw-sm-500"
      :class="{ 'has-selection': selectedBrand.length > 0 }"
    >
      <template #option="option">
        <span v-html="highlightSearch(`${option.name}`)" />
      </template>
    </ps-select>
  </b-form-group>
</template>

<script>
import PsSelect from '../commons/ps-select';

export default {
  name: 'ProductFeedSettingsExportExcludeBrand',
  data() {
    return {
      selectedBrand: [],
      searchString: '',
      /**
       * Fixtures, should be populated with PrestaShop datas
       */
      options: [
        {
          id: '1',
          name: 'Adidas',
        },
        {
          id: '2',
          name: 'Nike',
        },
        {
          id: '3',
          name: 'Hummel',
        },
        {
          id: '4',
          name: 'Kappa',
        },
        {
          id: '5',
          name: 'Le Coq Sportif',
        },
        {
          id: '6',
          name: 'New Balance',
        },
        {
          id: '7',
          name: 'Celio',
        },
        {
          id: '8',
          name: 'Suitsupply',
        },
        {
          id: '9',
          name: 'Burberry',
        },
        {
          id: '10',
          name: 'Bruce field',
        },
        {
          id: '11',
          name: 'Cos',
        },
        {
          id: '12',
          name: 'Jules',
        },
        {
          id: '13',
          name: 'Devred',
        },
        {
          id: '14',
          name: 'Pied de biche',
        },
        {
          id: '15',
          name: 'Bexley',
        },
        {
          id: '16',
          name: 'Charles tyrwhitt',
        },
      ],
    };
  },
  components: {
    PsSelect,
  },
  methods: {
    pushSelectedBrands(event) {
      this.selectedBrand = event;
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
  },
  mounted() {
  },
};
</script>
