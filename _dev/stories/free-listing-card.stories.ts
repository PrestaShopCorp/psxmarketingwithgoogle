import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import {productFeedEnabled, productFeedDisabled} from '../.storybook/mock/product-feed';
import {freeListingEnabled, freeListingDisabled, freeListingErrorAPI, freeListingCountryNotEligible} from '../.storybook/mock/free-listing';

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
  firstTime: true,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedEnabled
    this.$store.state.freeListing = freeListingDisabled
  },
}

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: true,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedEnabled
    this.$store.state.freeListing = freeListingEnabled
  },
}

export const AlertEnableFreeListing:any = Template.bind({});
AlertEnableFreeListing.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedEnabled
    this.$store.state.freeListing = freeListingDisabled
  },
}

// TODO : case to handle (store state, etc...)
// export const AlertCountryNotEligible:any = Template.bind({});
// AlertCountryNotEligible.args = {
//   isEnabled: true,
//   firstTime: false,
//   enabledFreeListing: false,
//   beforeCreate(this: any) {
//     this.$store.state.productFeed = productFeedEnabled
//     this.$store.state.freeListing = freeListingCountryNotEligible
//   },
// }

export const AlertCantEnableFreeListing:any = Template.bind({});
AlertCantEnableFreeListing.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedEnabled
    this.$store.state.freeListing = freeListingErrorAPI
  },
}
