import ProductFeedCard from '../src/components/product-feed/product-feed-card.vue'

const categoriesTotal = 17;
const basicArgs = {
  syncStatus: null,
  categoriesTotal,
  nbProductsReadyToSync: 210,
  nbProductsCantSync: 8,
  targetCountries: ['USA', 'France'],
  shippingSettings: 'Automatic',
  taxSettings: 'Automatic',
  syncRules: ['2:00 AM', 'export all products'],
  syncRulesDetails: ['Nike', 'Adidas', 'Reebok'],
  excludedProductsDetails: ['123956 - Totebag sunset', '123460 - Color block printed scarf', '975357 - Totebag electric blue', '3456231- Tartiflette savoyarde'],
  attributeMapping: ['Long description', 'condition', 'color'],
}

export default {
  title: 'Product feed/Card',
  component: ProductFeedCard,
  argTypes: {
    syncStatus: {
      control: {
        type: 'select',
        options: [null, 'schedule', 'warning', 'failed', 'success'],
      },
    },
    alert: {
      control: {
        type: 'select',
        options: [
            null,
            'Success',
            'Failed',
            'ShippingSettingsMissing',
            'ProductFeedDeactivated',
            'ProductFeedExists',
            'GoogleIsReviewingProducts'
        ],
      }
    },
    categoriesMapped: {
      control: {
        type: 'range',
        min: 0,
        max: categoriesTotal,
        step: 1,
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedCard },
  template: '<ProductFeedCard v-bind="$props" />',
  beforeMount: args.beforeMount,

});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  toConfigure: true,
  ...basicArgs,
};

export const EnabledToConfigure:any = Template.bind({});
EnabledToConfigure.args = {
  isEnabled: true,
  toConfigure: true,
  ...basicArgs,
};

export const EnabledConfigured:any = Template.bind({});
EnabledConfigured.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed.isConfigured = true;
  },
  isEnabled: true,
  ...basicArgs,
};
