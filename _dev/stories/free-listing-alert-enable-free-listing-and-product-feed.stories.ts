import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import {disableProductFeed} from '../.storybook/mock/product-feed';
import {disableFreeListing} from '../.storybook/mock/free-listing';

export default {
  title: 'Free listing/Card/Alert',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
  beforeCreate(this: any) {
    this.$store.state.productFeed = disableProductFeed;
    this.$store.state.freeListing = disableFreeListing;
  },
});

export const AlertEnableFreeListingAndProductFeed:any = Template.bind({});
AlertEnableFreeListingAndProductFeed.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
}
