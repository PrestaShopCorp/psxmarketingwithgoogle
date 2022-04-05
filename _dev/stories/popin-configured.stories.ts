import PopinConfigured from '../src/components/commons/popin-configured.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {initialStateApp} from "../.storybook/mock/state-app";
import {googleAccountConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {adsAccountStatus} from '../.storybook/mock/google-ads';
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';
export default {
  title: 'Basic Components/Popin When Configured',
  component: PopinConfigured,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PopinConfigured ,OnboardingPage},
  template: `
  <div>
  <OnboardingPage />
      <PopinConfigured ref="PopinModuleConfigured"        
      :visible="visible"
      />
      </div>
  `,
  beforeMount: args.beforeMount,
});

export const PopinWhenConfigured:any = Template.bind({});
PopinWhenConfigured.args = {
  visible: true,
  user: Object.assign({}, googleAccountConnected),
  beforeMount(this:any){
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
    this.$store.state.googleAds = Object.assign({}, adsAccountStatus);
  }
}
