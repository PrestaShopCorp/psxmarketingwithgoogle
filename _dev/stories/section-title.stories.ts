import SectionTitle from '../src/components/onboarding/section-title.vue'

export default {
  title: 'Onboarding/Components/SectionTitle',
  component: SectionTitle,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SectionTitle },
  template: '<SectionTitle v-bind="$props" />',
});

export const View:any = Template.bind({});
View.args = {
  stepNumber: 1,
  stepTitle: 'Your PrestaShop account',
  isEnabled: false,
  isDone: false,
}
