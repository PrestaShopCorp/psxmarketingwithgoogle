import HelpPage from '@/views/help.vue'

export default {
  title: 'Help Page/Help Page View',
  component: HelpPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HelpPage },
  template: '<HelpPage />',
});

export const HelpPageView:any = Template.bind({});
HelpPageView.args = {
};
