import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import {alertEnableFreeListing} from '../.storybook/mock/product-feed';
export default {
  title: 'Free listing/Card/Alert',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
  beforeCreate(this: any) {
    this.$store.state.productFeed = alertEnableFreeListing.productFeed;
    this.$store.state.freeListing = alertEnableFreeListing.freeListing;
  },
});

export const AlertEnableFreeListing:any = Template.bind({});
AlertEnableFreeListing.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
}
