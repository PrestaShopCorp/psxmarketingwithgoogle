import GlassScreen from '../src/components/commons/glass.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Basic Components/Glass',
  component: GlassScreen, OnboardingPage
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GlassScreen, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <GlassScreen />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const Glass:any = Template.bind({});
Glass.args = {}
