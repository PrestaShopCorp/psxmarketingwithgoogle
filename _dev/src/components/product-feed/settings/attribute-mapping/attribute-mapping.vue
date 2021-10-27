<template>
  <div>
    <b-form>
      <h3
        class="ps_gs-fz-20 font-weight-600 mb-2"
      >
        Map mandatory Google attributes to your custom fields
      </h3>
      <p>
        Google requires filling in a specific list of attributes depending on which product categories you sell. Map these attributes to your custom product fields to ensure your products are validated.
      </p>
      <b-form-group
        v-for="(category, index) in attributes"
        :key="category"
        :class="{'border-bottom': index !== attributes.length - 1}"
        class="mb-3 pb-2"
      >
        <VueShowdown
          v-if="category.legend"
          :markdown="category.legend"
          tag="legend"
          class="bg-transparent border-0 ps_gs-fz-14 font-weight-normal mb-3"
          :extensions="['no-p-tag']"
        />
        <b-form-row>
          <b-col
            v-for="field in category.fields"
            :key="field.label"
            :cols="12"
            :md="6"
          >
            <b-form-group
              :label="field.label"
              :label-for="field.label"
              label-class="font-weight-600"
            >
              <b-dropdown
                :text="field.default"
                variant=" "
                class="maxw-sm-250 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
                :toggle-class="{'ps-dropdown__placeholder' : true}"
                menu-class="ps-dropdown"
                size="sm"
              >
                <b-dropdown-item-button
                  button-class="text-dark"
                >
                  Not available
                </b-dropdown-item-button>
                <b-dropdown-form
                  v-for="option in options"
                  :key="option.label"
                >
                  <b-form-checkbox
                    class="ps_gs-checkbox"
                  >
                    {{ option.label }}
                  </b-form-checkbox>
                </b-dropdown-form>
              </b-dropdown>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-form-group>
    </b-form>
    <product-feed-settings-footer />
  </div>
</template>

<script>
import ProductFeedSettingsFooter from '../../product-feed-settings-footer';
export default {
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    ProductFeedSettingsFooter,
  },
  data() {
    return {
    };
  },
  computed: {
    disableContinue() {
      return false;
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
    options(){
      return [
        {
          label: 'tartiflette au fromage',
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
