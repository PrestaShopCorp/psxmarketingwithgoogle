import PsToast from '../src/components/commons/ps-toast.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountConnected} from "../.storybook/mock/google-account";

export default {
  title: 'Google Account/Toast/Connected',
  component: PsToast, OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PsToast, OnboardingPage},
  template: `
    <div>
      <b-toaster name="b-toaster-top-right"></b-toaster>
      <OnboardingPage />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountConnected;
    this.$store.state.accounts.googleAccount.connectedOnce = true;
  },
});

export const Connected:any = Template.bind({});
Connected.args = {
  visible: true,
};
