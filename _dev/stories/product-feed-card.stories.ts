import ProductFeedCard from '../src/components/product-feed/product-feed-card.vue'
import {
  productFeed,
  productFeedIsReadyForExport,
  productFeedIsConfigured,
  productFeedIsConfiguredWithTax,
  productFeedMissingFields,
  productFeedStatusSyncFailed,
  productFeedErrorAPI,
} from '../.storybook/mock/product-feed';
import {initialStateApp} from '../.storybook/mock/state-app';

export default {
  title: 'Product feed/Card',
  component: ProductFeedCard,
  parameters: {
    jest: ['product-feed-card.spec.ts'],
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
    this.$store.state.productFeed = Object.assign({}, productFeed);
  },
  isEnabled: false,
  badges: [],
};

export const NotConfigured:any = Template.bind({});
NotConfigured.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeed);
  },
  isEnabled: true,
};

// Todo: Handle all error cases

export const ReadyForExport:any = Template.bind({});
ReadyForExport.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedIsReadyForExport);
  },
  isEnabled: true,
};

export const Failed:any = Template.bind({});
Failed.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncFailed);
  },
  isEnabled: true,
};

export const SettingMissing:any = Template.bind({});
SettingMissing.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedMissingFields);
  },
  isEnabled: true,
};

export const OverwriteNeeded:any = Template.bind({});
OverwriteNeeded.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeed);
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
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
  },
  isEnabled: true,
};

// TODO batch 2
export const ConfiguredTax:any = Template.bind({});
ConfiguredTax.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredWithTax);
  },
  isEnabled: true,
};

export const ApiError:any = Template.bind({});
ApiError.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedErrorAPI);
  },
  isEnabled: true,
};
