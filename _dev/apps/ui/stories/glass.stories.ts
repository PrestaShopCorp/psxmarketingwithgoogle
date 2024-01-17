import PopupGlass from '@/components/commons/popup-glass.vue'
import OnboardingPage from '@/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Basic Components/Glass',
  component: PopupGlass, OnboardingPage
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PopupGlass, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <PopupGlass />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const Glass:any = Template.bind({});
Glass.args = {}
