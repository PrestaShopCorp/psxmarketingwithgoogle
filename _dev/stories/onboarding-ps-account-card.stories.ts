import PsAccountCard from '../src/components/ps-account/ps-account-card.vue'

export default {
  title: 'PS Account/Card',
  component: PsAccountCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PsAccountCard },
  template: '<PsAccountCard v-bind="$props" />',
});

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  isConnected: false,
}

export const Connected:any = Template.bind({});
Connected.args = {
  isConnected: true,
}
