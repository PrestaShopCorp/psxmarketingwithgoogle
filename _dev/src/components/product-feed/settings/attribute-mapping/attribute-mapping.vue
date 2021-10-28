<template>
  <div>
    <b-form>
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
        plain
      >
        <category-button
          v-for="category in categories"
          :key="category.value"
          :category="category"
        />
      </b-form-checkbox-group>
      <b-form-row>
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
      <p class="ps_gs-fz-12 text-muted">
        <a href="" target="_blank">Learn more about requirements for the Shopping product data specification</a>
      </p>
      <p class="ps_gs-fz-12 text-muted">
        Describe your product data using attributes. Additionally to required minimum for standard free listings, you can add additional attributes required for enhanced listing. General rule is: the more attributes the better.
      </p>
    </b-form>
    <product-feed-settings-footer />
  </div>
</template>

<script>
import ProductFeedSettingsFooter from '../../product-feed-settings-footer';
import AttributeField from './attribute-field.vue';
import CategoryButton from './category-button.vue';
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
    disableContinue() {
      return false;
    },
    categories() {
      return [
        {
          title: 'I sell Apparel and/or Accessories',
          subtitle: 'i.e clothing, bags, shoes or hats',
          icon: 'checkroom',
          value: 'apparelAndAccessories',
        },
      ]
    },
    attributes(){
      return [
        {
          category: 'Commons',
          legend: null,
          fields: [
            {
              label: 'Description',
              tooltip: true,
              required: true,
              default: 'bbb',
            },
            {
              label: 'GTIN (Global Trade Item Number)',
              tooltip: true,
              required: true,
              default: 'bbb',
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
          category: 'Apparel and Accessories',
          legend: 'These fields are mandatory if you sell Apparel and Accessories:',
          fields: [
            {
              label: 'Age Group',
              tooltip: true,
              required: true,
              default: 'bbb',
            },
          ],
        },
        {
          category: 'Home or Kitchen appliances',
          legend: 'This field is mandatory if you sell Home or Kitchen appliances:',
          fields: [
            {
              label: 'Energy class',
              tooltip: true,
              required: true,
              default: 'bbb',
            },
          ],
        },
      ]
    },
    /*
    sellApparel: {

      get() {
        // TODO
        // To clean in store
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_APPAREL_AND_ACCESSORIES'];
      },
      set(value) {
        return this.$store.commit(
          // TODO
          // To clean in store
          'productFeed/TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL', value,
        );
      },
    },
    */
    /*
    sellRefurbished: {
      get() {
        // TODO
        // To clean in store
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_REFURBISHED_PRODUCTS'];
      },
      set(value) {
        // TODO
        // To clean in store
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
};
</script>
