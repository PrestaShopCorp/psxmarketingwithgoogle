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
            v-for="group in attributes"
          >
            <b-col
              v-for="field in group.fields"
              :key="field.label + group.category"
              :cols="12"
              :md="6"
            >
              <attribute-field :field="field" />
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
    <div class="d-md-flex text-center justify-content-end mt-3">
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
    <product-feed-settings-footer />
  </div>
</template>

<script>
import ProductFeedSettingsFooter from '../../product-feed-settings-footer';
import AttributeField from './attribute-field.vue';
import CategoryButton from './category-button.vue';
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    ProductFeedSettingsFooter,
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
      // TODO: Confirm this validation rule
      return this.categoryProductsSelected.length;
    },
    disableContinue() {
      return false;
    },
    // TODO: Use an enum for categories values
    // Same enum should be reused for attributes categories
    categories() {
      return [
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.apparelAndAccessoriesTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.apparelAndAccessoriesSubtitle'),
          icon: 'checkroom',
          value: 'apparelAndAccessories',
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.electronicsTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.electronicsSubtitle'),
          icon: 'blender_black',
          value: 'electronics',
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.variantSetsTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.variantSetsSubtitle'),
          icon: 'filter_3',
          value: 'variantSets',
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.commonsTitle'),
          icon: 'select_all',
          value: 'commons',
        },
      ];
    },
    attributes() {
      // TODO: Fill the complete list of attributes
      return [
        {
          category: 'commons',
          fields: [
            {
              label: 'Description',
              tooltip: true,
              required: true,
              default: 'tooltip and required',
            },
            {
              label: 'GTIN (Global Trade Item Number)',
              tooltip: false,
              required: false,
              default: 'no tooltip, not required',
            },
            {
              label: 'MPN (Manufacturer Part Number)',
              tooltip: true,
              required: true,
              default: 'mpn',
            },
            {
              label: 'Brand',
              tooltip: true,
              required: true,
              default: 'brand',
            },
          ],
        },
        {
          category: 'apparelAndAccessories',
          fields: [
            {
              label: 'Age Group',
              tooltip: false,
              required: true,
              default: 'bbb',
            },
          ],
        },
        {
          category: 'electronics',
          fields: [
            {
              label: 'Energy class',
              tooltip: true,
              required: true,
              default: 'bbb',
            },
          ],
        },
        {
          category: 'variantSets',
          fields: [
            {
              label: 'Material',
              tooltip: true,
              required: true,
              default: 'bbb',
            },
            {
              label: 'Pattern',
              tooltip: true,
              required: true,
              default: 'bbb',
            },
          ],
        },
      ];
    },
    // TODO: Clean store, those getters/actions are from previous version of attribute mapping
    /*
    sellApparel: {
      get() {
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_APPAREL_AND_ACCESSORIES'];
      },
      set(value) {
        return this.$store.commit(
          'productFeed/TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL', value,
        );
      },
    },
    sellRefurbished: {
      get() {
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_REFURBISHED_PRODUCTS'];
      },
      set(value) {
        return this.$store.commit(
          'productFeed/TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_REFURBISHED', value,
        );
      },
    },
    */
  },
  methods: {
    nextStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
  googleUrl,
};
</script>
