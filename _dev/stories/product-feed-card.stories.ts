import ProductFeedCard from '../src/components/product-feed/product-feed-card.vue'
import { productFeed, productFeedMissingFields, productFeedIsConfigured, productFeedErrorAPI } from '../.storybook/mock/product-feed';

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

const date = new Date();

export default {
  title: 'Product feed/Card',
  component: ProductFeedCard,
  argTypes: {
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
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeed;
  },
  isEnabled: false,
};

export const NotConfigured:any = Template.bind({});
NotConfigured.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeed;
  },
  isEnabled: true,
  ...basicArgs,
};

// Todo: Handle all error cases

export const ReadyForExport:any = Template.bind({});
ReadyForExport.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured;
    this.$store.state.productFeed.status = {
      failedSyncs: [],
      successfulSyncs: [],
      shopHealthy: true,
      jobEndedAt: '',
      nextJobAt: date,
    };
    this.$store.state.productFeed.settings.autoImportShippingSettings = true;
  },
  isEnabled: true,
};

export const Failed:any = Template.bind({});
Failed.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured;
    this.$store.state.productFeed.status = {
      failedSyncs: ['foo'],
      successfulSyncs: [],
      shopHealthy: true,
      jobEndedAt: date,
      nextJobAt: date,
    };
    this.$store.state.productFeed.settings.autoImportShippingSettings = true;
  },
  isEnabled: true,
};

export const SettingMissing:any = Template.bind({});
SettingMissing.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured;
    this.$store.state.productFeed.status = {
      failedSyncs: [],
      successfulSyncs: [],
      shopHealthy: true,
      jobEndedAt: date,
      nextJobAt: date,
    };
    this.$store.state.productFeed.settings.autoImportShippingSettings = undefined;
  },
  isEnabled: true,
};

export const OverwriteNeeded:any = Template.bind({});
OverwriteNeeded.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeed;
  },
  isEnabled: true,
};
// ! Add BIG warning: not developed yet
OverwriteNeeded.decorators = [() => ({
  template: `
    <div>
      <h2>
        ⚠️ TODO: Handle state, this story isn't developed yet ⚠️
      </h2>
      <story />
    </div>
  `
})];

export const ConfiguredNoTax:any = Template.bind({});
ConfiguredNoTax.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured;
    this.$store.state.productFeed.settings.targetCountries = ['FR'];
    this.$store.state.productFeed.settings.autoImportShippingSettings = true;
    this.$store.state.productFeed.status.successfulSyncs = [date];
  },
  isEnabled: true,
};

export const ConfiguredTax:any = Template.bind({});
ConfiguredTax.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured;
    this.$store.state.productFeed.settings.targetCountries = ['FR', 'US'];
    this.$store.state.productFeed.settings.autoImportShippingSettings = true;
    this.$store.state.productFeed.status.successfulSyncs = [date];
  },
  isEnabled: true,
};

export const ApiError:any = Template.bind({});
ApiError.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = productFeedErrorAPI;
},
  isEnabled: true,
};
// ! Add BIG warning: not developed yet
ApiError.decorators = [() => ({
  template: `
    <div>
      <h2>
        ⚠️ TODO: Handle state, this story isn't developed yet ⚠️
      </h2>
      <story />
    </div>
  `
})];
