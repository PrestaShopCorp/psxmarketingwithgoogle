import ProductFeedSettings from '../src/components/product-feed/product-feed-settings.vue'
import Stepper from '../src/components/commons/stepper.vue'

export default {
  title: 'Product feed/Settings',
  component: ProductFeedSettings,
  subcomponents: { Stepper }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSettings },
  template: '<ProductFeedSettings v-bind="$props" />',
});

export const ShippingSettings:any = Template.bind({});
ShippingSettings.args = {
  activeStep: 1,
}
