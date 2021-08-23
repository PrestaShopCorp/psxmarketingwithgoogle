import LandingPage from '../src/views/landing-page.vue'

export default {
  title: 'LandingPage/Landing Page View',
  component: LandingPage,
  parameters: {
    jest: ['landing-page.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPage },
  template: '<LandingPage />',
});

export const LandingPageView:any = Template.bind({});
LandingPageView.args = {
};
