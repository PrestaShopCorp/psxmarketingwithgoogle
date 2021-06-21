import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import {alertEnableFreeListingAndProductFeed} from '../.storybook/mock/product-feed';
export default {
  title: 'Free listing/Card/Alert',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
  beforeCreate(this: any) {
    this.$store.state.productFeed = alertEnableFreeListingAndProductFeed.productFeed;
    this.$store.state.freeListing = alertEnableFreeListingAndProductFeed.freeListing;
  },
});

export const AlertEnableFreeListingAndProductFeed:any = Template.bind({});
AlertEnableFreeListingAndProductFeed.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
}
