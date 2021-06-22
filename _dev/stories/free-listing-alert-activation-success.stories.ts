import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import {enableProductFeed} from '../.storybook/mock/product-feed';
import {enableFreeListing} from '../.storybook/mock/free-listing';

export default {
  title: 'Free listing/Card/Alert',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
  beforeCreate(this: any) {
    this.$store.state.productFeed = enableProductFeed
    this.$store.state.freeListing = enableFreeListing
  },
});

export const AlertActivationSuccess:any = Template.bind({});
AlertActivationSuccess.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: true,
}
