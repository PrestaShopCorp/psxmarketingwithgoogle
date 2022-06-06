import PmaxDiscoverModal from '../src/components/pmax/pmax-integration-modals/pmax-discover-modal.vue';
import PmaxModalType from '../src/enums/pmax/pmax-modal';
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountConnected} from "../.storybook/mock/google-account";

export default {
  title: 'Performance Max/Popins/Discover',
  component: PmaxDiscoverModal, OnboardingPage
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PmaxDiscoverModal, OnboardingPage },
  template: `
    <div>
      <OnboardingPage />
      <PmaxDiscoverModal v-bind="$props" />
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
  type: PmaxModalType.COMING_SOON,
};

export const PMAXReleased:any = Template.bind({});
PMAXReleased.args = {
  visible: true,
  type: PmaxModalType.PMAX_RELEASED,
};

export const SSCDeprecated:any = Template.bind({});
SSCDeprecated.args = {
  visible: true,
  type: PmaxModalType.SSC_DEPRECATED,
};
