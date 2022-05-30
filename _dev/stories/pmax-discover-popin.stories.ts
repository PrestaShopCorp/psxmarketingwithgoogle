import PmaxDiscoverPopin from '../src/components/pmax/pmax-integration-popins/pmax-discover-popin.vue';
import { PmaxPopinType } from '../src/enums/pmax/pmax-popin';
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountConnected} from "../.storybook/mock/google-account";

export default {
  title: 'Performance Max/Popins/Discover',
  component: PmaxDiscoverPopin, OnboardingPage
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PmaxDiscoverPopin, OnboardingPage },
  template: `
    <div>
      <OnboardingPage />
      <PmaxDiscoverPopin v-bind="$props" />
    </div>
  `,
  mounted: args.mounted,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
  },
});

export const PMAXComingSoon:any = Template.bind({});
PMAXComingSoon.args = {
  visible: true,
  type: PmaxPopinType.COMING_SOON,
};

export const PMAXReleased:any = Template.bind({});
PMAXReleased.args = {
  visible: true,
  type: PmaxPopinType.PMAX_RELEASED,
};

export const SSCDeprecated:any = Template.bind({});
SSCDeprecated.args = {
  visible: true,
  type: PmaxPopinType.SSC_DEPRECEATED,
};
