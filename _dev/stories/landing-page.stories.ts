import LandingPage from '../src/views/landing-page.vue'

export default {
  title: 'LandingPage/LandingPage',
  component: LandingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPage },
  template: '<LandingPage />',
});

export const View:any = Template.bind({});
View.args = {
};
