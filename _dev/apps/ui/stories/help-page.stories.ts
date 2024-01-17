import HelpPage from '@/views/help-page.vue'
import {contextPsAccountsConnectedAndValidated} from '../.storybook/mock/ps-accounts';

export default {
  title: 'Help Page/Help Page View',
  component: HelpPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HelpPage },
  template: '<HelpPage />',
  beforeMount(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const HelpPageView:any = Template.bind({});
HelpPageView.args = {
};
