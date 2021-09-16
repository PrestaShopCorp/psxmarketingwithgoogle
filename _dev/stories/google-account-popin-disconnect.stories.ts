import GoogleAccountPopinDisconnect from '../src/components/google-account/google-account-popin-disconnect.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountConnected} from "../.storybook/mock/google-account";

export default {
  title: 'Google Account/Popins/Disconnect',
  component: GoogleAccountPopinDisconnect, OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAccountPopinDisconnect, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <GoogleAccountPopinDisconnect v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
  },
});

export const Disconnect:any = Template.bind({});
Disconnect.args = {
  visible: true,
};
