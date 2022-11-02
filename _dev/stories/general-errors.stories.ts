import App from '@/App.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountNotConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected} from "../.storybook/mock/merchant-center-account";

export default {
  title: 'General/Errors',
  component: App,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {App},
  template: `
    <App/>
  `,
  beforeMount: args.beforeMount,
  watch: {},
});

export const UserIsDisconnectedFromBO:any = Template.bind({});
UserIsDisconnectedFromBO.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountNotConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountNotConnected);
  },
};