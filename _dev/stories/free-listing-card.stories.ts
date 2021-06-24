import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import {enableProductFeed, disableProductFeed} from '../.storybook/mock/product-feed';
import {enableFreeListing, disableFreeListing} from '../.storybook/mock/free-listing';

export default {
  title: 'Free listing/Card',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
  beforeCreate : args.beforeCreate,
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
}

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
}

export const AlertEnableFreeListing:any = Template.bind({});
AlertEnableFreeListing.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
  beforeCreate(this: any) {
    this.$store.state.productFeed = enableProductFeed
    this.$store.state.freeListing = disableFreeListing
  },
}

export const AlertActivationSuccess:any = Template.bind({});
AlertActivationSuccess.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: true,
  beforeCreate(this: any) {
    this.$store.state.productFeed = enableProductFeed
    this.$store.state.freeListing = enableFreeListing
  },
}

export const AlertEnableFreeListingAndProductFeed:any = Template.bind({});
AlertEnableFreeListingAndProductFeed.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
  beforeCreate(this: any) {
    this.$store.state.productFeed = disableProductFeed;
    this.$store.state.freeListing = disableFreeListing;
  },
}

export const AlertProductFeedDisabled:any = Template.bind({});
AlertProductFeedDisabled.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: true,
  beforeCreate(this: any) {
    this.$store.state.productFeed = disableProductFeed;
    this.$store.state.freeListing = enableFreeListing;
  },
}
