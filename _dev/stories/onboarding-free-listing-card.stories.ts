import FreeListingCard from '../src/components/onboarding/free-listing-card.vue'

export default {
  title: 'Onboarding/Components/Card - Free listing',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
}

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
}
