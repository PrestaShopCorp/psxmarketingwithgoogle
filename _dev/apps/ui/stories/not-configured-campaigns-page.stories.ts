import CampaignPageNotConfigured from '../src/views/not-configured/campaign-page.vue';

export default {
  title: 'Not Configured Pages/Campaign Page Without account',
  component: CampaignPageNotConfigured,
  parameters: {
    jest: ['stepper.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignPageNotConfigured },
  template: '<CampaignPageNotConfigured v-bind="$props" />',
});

export const CampaignPage:any = Template.bind({});
CampaignPage.args = {
};
