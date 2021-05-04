<template>
  <b-form-group
    class="mt-4 pb-2"
  >
    <p class="font-weight-600 mb-1 p-0 d-block">
      {{ $t('productFeedSettings.export.selectCategoriesToExport') }}
    </p>
    <ul class="ps_gs-categories-list">
      <li>
        <b-form-checkbox
          class="ps_gs-checkbox"
          name="allCategories"
          :indeterminate.sync="allCategoriesIndeterminate"
          inline
        >
          {{ $t('productFeedSettings.export.allCategories') }}
        </b-form-checkbox>
        <ul>
          <li v-for="(n,index) in 5" :key="index">
            <b-form-checkbox
              class="ps_gs-checkbox"
              name="allCategories"
              inline
            >
              Catégorie {{ n }}
            </b-form-checkbox>
            <ul>
              <li v-for="(n,index) in 3" :key="index">
                <b-form-checkbox
                  class="ps_gs-checkbox"
                  name="allCategories"
                  inline
                >
                  Catégorie {{ n }}
                </b-form-checkbox>
                <ul>
                  <li v-for="(n,index) in 2" :key="index">
                    <b-form-checkbox
                      class="ps_gs-checkbox"
                      name="allCategories"
                      inline
                    >
                      Catégorie {{ n }}
                    </b-form-checkbox>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </b-form-group>
</template>

<script>

export default {
  name: 'ProductFeedSettingsExportExcludeCategory',
  data() {
    return {
      allCategoriesIndeterminate: true,
    };
  },
};
</script>
