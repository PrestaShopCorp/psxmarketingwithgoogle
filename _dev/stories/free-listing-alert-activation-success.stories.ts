import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import {alertSuccessValidation} from '../.storybook/mock/product-feed';
export default {
  title: 'Free listing/Card/Alert',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
  beforeCreate(this: any) {
    this.$store.state.productFeed = alertSuccessValidation.productFeed;
    this.$store.state.freeListing = alertSuccessValidation.freeListing;
  },
});

export const AlertActivationSuccess:any = Template.bind({});
AlertActivationSuccess.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: true,
}
