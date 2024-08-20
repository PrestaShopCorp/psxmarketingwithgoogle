import PopinUpdateModule from '../src/components/commons/popin-update-module.vue';

export default {
  title: 'Onboarding/Popins',
  component: PopinUpdateModule,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {PopinUpdateModule},
  template:
    '<PopinUpdateModule v-bind="$props" />',
});

export const UpdateModule: any = Template.bind({});
UpdateModule.args = {
  text: 'Your current version of the PrestaShop Marketing module is out of date. Daily synchronization with Google Merchant Center is paused. Update now to continue using the module.',
};
