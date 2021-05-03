import ProductFeedSettings from '../src/components/product-feed/product-feed-settings.vue'
import Stepper from '../src/components/commons/stepper.vue'
import { Products } from '../fixtures/products.js';

export default {
  title: 'Product feed/Settings',
  component: ProductFeedSettings,
  subcomponents: { Stepper },
  argTypes: {
    activeStep: {
      options: [1, 2, 3, 4, 5],
      control: { type: 'select' },
    },
  },
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


export const ExportSettings:any = Template.bind({});
ExportSettings.args = {
  activeStep: 2,
  options: Products,
}

export const AttributeMapping:any = Template.bind({});
AttributeMapping.args = {
  activeStep: 3,
}
