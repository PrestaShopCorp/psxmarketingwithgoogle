<template>
  <div>
    <b-form>
      <section>
        <h3
          class="mb-2 ps_gs-fz-20 font-weight-600"
        >
          {{ $t('productFeedSettings.attributeMapping.title1') }}
        </h3>
        <p>
          {{ $t('productFeedSettings.attributeMapping.description1') }}
        </p>
        <b-form-checkbox-group
          id="categoryProducts"
          v-model="selectedProductCategories"
          name="categoryProducts"
          class="py-2 mb-4"
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
        data-test-id="section-attribute-field"
      >
        <h3
          class="mb-2 ps_gs-fz-20 font-weight-600"
        >
          {{ $t('productFeedSettings.attributeMapping.title2') }}
        </h3>
        <p>
          {{ $t('productFeedSettings.attributeMapping.description2') }}
        </p>
        <div
          class="mt-3 text-center"
          v-if="loading"
        >
          <div
            class="spinner"
          />
        </div>
        <b-form-row
          class="mt-2"
          v-else
        >
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
      class="text-primary"
    >
      <a
        class="mb-0 ps_gs-fz-12 text-primary"
        :href="$store.getters['app/GET_ATTRIBUTES_URL']"
        target="_blank"
      >
        {{ $t('productFeedSettings.attributeMapping.addNewAttributes') }}
      </a>
      <span class="ps_gs-fz-12 text-dark">
        |
      </span>
      <b-button
        size="sm"
        variant="link"
        class="p-0 text-left border-0 ps_gs-fz-12 font-weight-normal text-decoration-underline"
        @click="refreshComponent"
      >
        {{ $t('productFeedSettings.attributeMapping.refreshAttributes') }}
        <i class="material-icons ps_gs-fz-12">refresh</i>
      </b-button>
    </div>

    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      :disable-continue="disableContinue"
      @cancelProductFeedSettingsConfiguration="cancel()"
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
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';

import {
  formatMappingToApi,
} from '../../../../utils/AttributeMapping';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

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
      loading: false,
    };
  },
  computed: {
    mappingSectionVisible() {
      return this.selectedProductCategories.length;
    },
    disableContinue() {
      return this.selectedProductCategories.length === 0;
    },
    getPropertyFromShop() {
      return this.$store.getters['productFeed/GET_SHOP_ATTRIBUTES'];
    },
    selectedProductCategories: {
      get() {
        return this.$store.getters['productFeed/GET_PRODUCT_CATEGORIES_SELECTED'];
      },
      set(value) {
        this.$store.commit('productFeed/SET_SELECTED_PRODUCT_CATEGORIES', value);
      },
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
          (attr) => this.selectedProductCategories.includes(attr.category)
            || attr.category === Categories.COMMONS,
        );
    },
  },
  methods: {
    previousStep() {
      localStorage.setItem('productFeed-attributeMapping', JSON.stringify(formatMappingToApi(this.attributesToMap)));
      if (this.$store.state.productFeed.settings.autoImportShippingSettings) {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 2);
        this.$router.push({
          name: 'product-feed-settings',
          params: {
            step: ProductFeedSettingsPages.SHIPPING_SETTINGS,
          },
        });
      } else {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
        this.$router.push({
          name: 'product-feed-settings',
          params: {
            step: ProductFeedSettingsPages.TARGET_COUNTRY,
          },
        });
      }
      window.scrollTo(0, 0);
    },
    nextStep() {
      this.$segment.track('[GGL] Product feed config - Step 3', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      localStorage.setItem('productFeed-attributeMapping', JSON.stringify(formatMappingToApi(this.attributesToMap)));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SYNC_SCHEDULE,
        },
      });
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    categoryProductsChanged(category, isSelected) {
      if (!isSelected) {
        return;
      }
      this.$store.dispatch('productFeed/REQUEST_PRODUCT_CATEGORIES_CHANGED', category);
    },
    refreshComponent() {
      this.$store.dispatch('productFeed/REQUEST_SHOP_TO_GET_ATTRIBUTE');
    },
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch('productFeed/REQUEST_SHOP_TO_GET_ATTRIBUTE').then(() => {
      this.$store.dispatch('productFeed/REQUEST_ATTRIBUTE_MAPPING').finally(() => {
        this.loading = false;
      });
    });
  },
  googleUrl,
};
</script>
