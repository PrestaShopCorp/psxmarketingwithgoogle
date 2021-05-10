import SectionTitle from '../src/components/onboarding/section-title.vue'

export default {
  title: 'Onboarding/Components/Title',
  component: SectionTitle,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SectionTitle },
  template: '<SectionTitle v-bind="$props" />',
});

export const Title:any = Template.bind({});
Title.args = {
  stepNumber: 1,
  stepTitle: 'Your PrestaShop account',
  isEnabled: false,
  isDone: false,
}
