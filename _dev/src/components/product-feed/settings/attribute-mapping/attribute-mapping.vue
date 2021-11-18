<template>
  <div>
    <b-form>
      <section>
        <h3
          class="ps_gs-fz-20 font-weight-600 mb-2"
        >
          {{ $t('productFeedSettings.attributeMapping.title1') }}
        </h3>
        <p>
          {{ $t('productFeedSettings.attributeMapping.description1') }}
        </p>
        <b-form-checkbox-group
          id="categoryProducts"
          v-model="categoryProductsSelected"
          name="categoryProducts"
          class="mb-4 py-2"
          plain
        >
          <category-button
            v-for="category in categories"
            :key="category.value"
            :category="category"
            @categoryProductsChanged="categoryProductsChanged"
          />
        </b-form-checkbox-group>
      </section>
      <section
        class="mb-2"
        v-if="mappingSectionVisible"
      >
        <h3
          class="ps_gs-fz-20 font-weight-600 mb-2"
        >
          {{ $t('productFeedSettings.attributeMapping.title2') }}
        </h3>
        <p>
          {{ $t('productFeedSettings.attributeMapping.description2') }}
        </p>
        <b-form-row class="mt-2">
          <template
            v-for="group in attributesToMap"
          >
            <b-col
              v-for="field in group.fields"
              :key="field.label + group.category"
              :cols="12"
              :md="6"
            >
              <attribute-field
                :field="field"
                :category="group.category"
              />
            </b-col>
          </template>
        </b-form-row>
      </section>
      <p class="ps_gs-fz-12 text-primary">
        <a
          :href="$options.googleUrl.learnRequirementsProductSpecification"
          target="_blank"
        >
          {{ $t('productFeedSettings.attributeMapping.learnRequirementsProductSpecification') }}
        </a>
      </p>
      <p class="ps_gs-fz-12 text-muted">
        {{ $t('productFeedSettings.attributeMapping.footerNotice') }}
      </p>
    </b-form>

    <div
      class="d-flex"
    >
      <VueShowdown
        class="ps_gs-fz-12 mb-0 text-primary"
        tag="p"
        :markdown="$t('productFeedSettings.attributeMapping.addNewAttributes',
                      [$store.getters['app/GET_ATTRIBUTES_URL']])"
        :extensions="['extended-link', 'no-p-tag']"
      />
      <p class="ps_gs-fz-12">
        |
      </p>
      <b-button
        variant="link"
        class="ps_gs-fz-12 text-primary"
        @click="refreshComponent"
      >
        {{ $t('productFeedSettings.attributeMapping.refreshAttributes') }}
      </b-button>
    </div>

    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      :disable-continue="disableContinue"
    />
    <settings-footer />
  </div>
</template>

<script>
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import AttributeField from './attribute-field.vue';
import CategoryButton from './category-button.vue';
import googleUrl from '@/assets/json/googleUrl.json';
import Categories from '@/enums/product-feed/attribute-mapping-categories';

export default {
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    SettingsFooter,
    ActionsButtons,
    AttributeField,
    CategoryButton,
  },
  data() {
    return {
      categoryProductsSelected: [],
    };
  },
  computed: {
    mappingSectionVisible() {
      return this.categoryProductsSelected.length;
    },
    disableContinue() {
      return this.categoryProductsSelected.length === 0;
    },
    getPropertyFromShop() {
      return this.$store.getters['productFeed/GET_SHOP_ATTRIBUTES'];
    },
    categories() {
      return [
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.apparelAndAccessoriesTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.apparelAndAccessoriesSubtitle'),
          icon: 'checkroom',
          value: Categories.APPAREL_AND_ACCESSORIES,
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.electronicsTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.electronicsSubtitle'),
          icon: 'blender_black',
          value: Categories.ELECTRONICS,
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.variantSetsTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.variantSetsSubtitle'),
          icon: 'filter_3',
          value: Categories.VARIANT_SETS,
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.commonsTitle'),
          icon: 'select_all',
          value: Categories.NONE,
        },
      ];
    },
    attributesToMap() {
      return this.$store.getters['productFeed/GET_FREE_LISTING_ATTRIBUTES_TO_MAP']
        .filter(
          (attr) => this.categoryProductsSelected.includes(attr.category)
            || attr.category === Categories.COMMONS,
        );
    },
    formatMappingToApi() {
      return this.attributesToMap
        .map((attr) => attr.fields)
        .reduce((acc, cur) => acc.concat(cur), [])
        .reduce((acc, cur) => {
          if (cur.mapped !== null) {
            acc[cur.name] = cur.mapped.map((attr) => ({
              id: attr.name,
              type: attr.type,
            }));
          } else {
            acc[cur.name] = cur.recommended.map((attr) => ({
              id: attr.name,
              type: attr.type,
            }));
          }
          return acc;
        }, {});
    },
  },
  methods: {
    previousStep() {
      localStorage.setItem('attributeMapping', JSON.stringify(this.formatMappingToApi));
      if (this.$store.state.productFeed.settings.autoImportShippingSettings) {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 2);
      } else {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
      }
      window.scrollTo(0, 0);
    },
    nextStep() {
      localStorage.setItem('attributeMapping', JSON.stringify(this.formatMappingToApi));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    categoryProductsChanged(category, isSelected) {
      localStorage.setItem('categoryProductsSelected', JSON.stringify(this.categoryProductsSelected));
      if (!isSelected) {
        return;
      }
      if (category === Categories.NONE) {
        this.categoryProductsSelected = this.categoryProductsSelected
          .filter((cat) => cat === Categories.NONE);
      }
      if (category !== Categories.NONE && this.categoryProductsSelected.includes(Categories.NONE)) {
        this.categoryProductsSelected = this.categoryProductsSelected
          .filter((cat) => cat !== Categories.NONE);
      }
    },
    refreshComponent() {
      this.$store.dispatch('productFeed/REQUEST_SHOP_TO_GET_ATTRIBUTE');
    },
  },
  mounted() {
    this.$store.dispatch('productFeed/REQUEST_ATTRIBUTE_MAPPING');
    this.categoryProductsSelected = localStorage.getItem('categoryProductsSelected')
      ? JSON.parse(localStorage.getItem('categoryProductsSelected'))
      : [];
  },

  googleUrl,
};
</script>
