import TunnelProductFeed from '../src/views/tunnel-product-feed.vue'
import Stepper from '../src/components/commons/stepper.vue'

export default {
  title: 'Product feed/Settings',
  component: TunnelProductFeed,
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
  components: { TunnelProductFeed },
  template: '<div><TunnelProductFeed v-bind="$props" /></div>',
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
