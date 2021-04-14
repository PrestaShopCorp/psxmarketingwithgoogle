import OnboardingPage from '../src/views/onboarding-page.vue'

export default {
  title: 'Onboarding/OnboardingPage',
  component: OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: '<OnboardingPage  />',
});

export const View:any = Template.bind({});
View.args = {};
