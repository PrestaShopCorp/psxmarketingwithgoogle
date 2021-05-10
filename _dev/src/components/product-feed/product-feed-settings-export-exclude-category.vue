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
          <li
            v-for="(nCategory,index) in 5"
            :key="index"
          >
            <b-form-checkbox
              class="ps_gs-checkbox"
              name="allCategories"
              inline
            >
              Catégorie {{ nCategory }}
            </b-form-checkbox>
            <ul>
              <li
                v-for="(nCategory2,index2) in 3"
                :key="index2"
              >
                <b-form-checkbox
                  class="ps_gs-checkbox"
                  name="allCategories"
                  inline
                >
                  Catégorie {{ nCategory2 }}
                </b-form-checkbox>
                <ul>
                  <li
                    v-for="(nCategory3,index3) in 2"
                    :key="index3"
                  >
                    <b-form-checkbox
                      class="ps_gs-checkbox"
                      name="allCategories"
                      inline
                    >
                      Catégorie {{ nCategory3 }}
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
