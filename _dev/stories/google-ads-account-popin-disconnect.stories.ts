import GoogleAdsAccountPopinDisconnect from '../src/components/google-ads-account/google-ads-account-popin-disconnect.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';

export default {
  title: 'Google Ads Account/Popins/Disconnect',
  component: GoogleAdsAccountPopinDisconnect, OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountPopinDisconnect, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <GoogleAdsAccountPopinDisconnect v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
});

export const Disconnect:any = Template.bind({});
Disconnect.args = {
  visible: true,
};
