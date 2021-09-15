import GoogleAdsAccountPopinNew from '../src/components/google-ads-account/google-ads-account-popin-new.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {
  googleAccountConnected,
} from "../.storybook/mock/google-account";
import {
  initialStateApp,
} from "../.storybook/mock/state-app";
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';

export default {
  title: 'Google Ads Account/Popins',
  component: GoogleAdsAccountPopinNew,OnboardingPage,
  parameters: {
    jest: ['google-ads-account-popin-new.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountPopinNew,OnboardingPage },
  template: `
    <div>
      <OnboardingPage />
      <GoogleAdsAccountPopinNew
        ref="googleAdsAccountPopin"
        v-bind="$props"
      />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
  mounted(this:any) {
    this.$refs.googleAdsAccountPopin.$data.stepActiveData = args.stepActiveData;
  }
});

export const StepOne:any = Template.bind({});
StepOne.args = {
  visible: true,
  stepActiveData: 1,
  user: Object.assign({}, googleAccountConnected),
};

export const StepTwo:any = Template.bind({});
StepTwo.args = {
  visible: true,
  stepActiveData: 2,
  user: Object.assign({}, googleAccountConnected),

};

export const StepThree:any = Template.bind({});
StepThree.args = {
  visible: true,
  stepActiveData: 3,
  user: Object.assign({}, googleAccountConnected),

};
