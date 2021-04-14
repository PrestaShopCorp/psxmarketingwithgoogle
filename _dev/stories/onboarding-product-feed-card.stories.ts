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

export const Default:any = Template.bind({});
Default.args = {
  isEnabled: false,
}
