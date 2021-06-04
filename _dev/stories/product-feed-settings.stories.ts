import ProductFeedSettings from '../src/components/product-feed/product-feed-settings.vue'
import Stepper from '../src/components/commons/stepper.vue'

export default {
  title: 'Product feed/Settings',
  component: ProductFeedSettings,
  subcomponents: { Stepper },
  argTypes: {
    activeStep: {
      options: [1, 2, 3, 4],
      control: { type: 'select' },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSettings, },
  template:
    `<div>
      <ProductFeedSettings v-bind="$props" />
    </div>`,
});

export const ShippingSettings:any = Template.bind({});
ShippingSettings.args = {
  activeStep: 1,
}


export const ExportSettings:any = Template.bind({});
ExportSettings.args = {
  activeStep: 2,
}

export const AttributeMapping:any = Template.bind({});
AttributeMapping.args = {
  activeStep: 3,
}

export const Summary:any = Template.bind({});
Summary.args = {
  activeStep: 4,
}
