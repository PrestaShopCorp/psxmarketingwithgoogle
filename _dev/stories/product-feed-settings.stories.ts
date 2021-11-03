import TunnelProductFeed from '../src/views/tunnel-product-feed.vue';
import {productFeed, productFeedIsReadyForExport} from '../.storybook/mock/product-feed';
import {initialStateApp} from '../.storybook/mock/state-app';

export default {
  title: 'Product feed/Settings',
  component: TunnelProductFeed,
  // parameters: {
  //   jest: [
  //     // 'tunnel-product-feed.spec.ts',
  //     // 'summary.spec.ts',
  //     // 'target-countries.spec.ts',
  //     // 'product-feed-settings-attribute-mapping.spec.ts',
  //   ],
  // },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {TunnelProductFeed},
  template: '<div><TunnelProductFeed v-bind="$props" /></div>',
  beforeMount: args.beforeMount,
});

export const TargetCountry:any = Template.bind({});
TargetCountry.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign(productFeed);
    this.$store.state.app = Object.assign(initialStateApp);
    this.$store.state.productFeed.stepper = 1;
  },
};

export const ExportSettings:any = Template.bind({});
ExportSettings.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign(productFeed);
    this.$store.state.productFeed.stepper = 2;
  },
};

export const AttributeMapping:any = Template.bind({});
AttributeMapping.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign(productFeed);
    this.$store.state.productFeed.stepper = 3;
  },
};

export const Summary:any = Template.bind({});
Summary.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign(productFeedIsReadyForExport);
    this.$store.state.productFeed.stepper = 4;
  },
};
