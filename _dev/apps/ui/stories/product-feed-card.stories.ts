import cloneDeep from 'lodash.clonedeep';
import ProductFeedCard from '@/components/onboarding/product-feed-card.vue';
import {
  productFeed,
  productFeedIsReadyForExport,
  productFeedIsConfigured,
  productFeedIsConfiguredWithTax,
  productFeedMissingFields,
  productFeedStatusSyncFailed,
  productFeedErrorAPI,
} from '../.storybook/mock/product-feed';

export default {
  title: 'Product feed/Card',
  component: ProductFeedCard,
  parameters: {
    jest: ['product-feed-card.spec.ts'],
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {ProductFeedCard},
  template: '<ProductFeedCard v-bind="$props" />',
  beforeMount: args.beforeMount,
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
  },
  isEnabled: false,
  loading: false,
  badges: [],
};

export const NotConfiguredAndCanStart:any = Template.bind({});
NotConfiguredAndCanStart.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
  },
  isEnabled: true,
  loading: false,
};

export const NotConfiguredAndCanContinue:any = Template.bind({});
NotConfiguredAndCanContinue.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 3;
  },
  isEnabled: true,
  loading: false,
};

// Todo: Handle all error cases

export const ReadyForExport:any = Template.bind({});
ReadyForExport.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsReadyForExport);
  },
  isEnabled: true,
  loading: false,
};

export const Failed:any = Template.bind({});
Failed.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedStatusSyncFailed);
  },
  isEnabled: true,
  loading: false,
};

export const MissingShippingSettings:any = Template.bind({});
MissingShippingSettings.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedMissingFields);
  },
  isEnabled: true,
  loading: false,
};

export const OverwriteNeeded:any = Template.bind({});
OverwriteNeeded.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
  },
  isEnabled: true,
  loading: false,
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
  `,
})];

export const ConfiguredNoTax:any = Template.bind({});
ConfiguredNoTax.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsConfigured);
  },
  isEnabled: true,
  loading: false,
};

// TODO batch 2
export const ConfiguredTax:any = Template.bind({});
ConfiguredTax.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsConfiguredWithTax);
  },
  isEnabled: true,
  loading: false,
};

export const ApiError:any = Template.bind({});
ApiError.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedErrorAPI);
  },
  isEnabled: true,
  loading: false,
};
