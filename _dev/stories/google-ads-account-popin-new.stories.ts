import GoogleAdsAccountPopinNew from '../src/components/google-ads-account/google-ads-account-popin-new.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {initialStateApp} from "../.storybook/mock/state-app";
import {googleAccountConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';

export default {
  title: 'Google Ads Account/Popins',
  component: GoogleAdsAccountPopinNew, OnboardingPage,
  parameters: {
    jest: ['google-ads-account-popin-new.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountPopinNew, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <GoogleAdsAccountPopinNew v-bind="$props" 
      ref="googleAdsAccountPopin"
      />
    </div>
  `,
  beforeMount: args.beforeMount,
});
export const New:any = Template.bind({});
New.args = {
  visible: true,
  user: Object.assign({}, googleAccountConnected),
  beforeMount(this:any){
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  }
};
