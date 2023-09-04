import App from '@/App.vue';
import cloneDeep from 'lodash.clonedeep';
import {googleAccountConnected} from '../.storybook/mock/google-account';
import {conversionTrackingIsTrue} from '../.storybook/mock/campaigns';
import {campaigns} from '../.storybook/mock/campaigns-list';
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {initialStateApp} from "../.storybook/mock/state-app";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {adsAccountStatus} from '../.storybook/mock/google-ads';
import {productFeedStatusSyncSuccess} from '../.storybook/mock/product-feed';

export default {
  title: 'Whole application/Overview',
  component: App
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { App },
  template: `
    <div>
      <App />
    </div>
  `,
  beforeCreate(this:any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = cloneDeep(googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = cloneDeep(merchantCenterAccountConnected);
    this.$store.state.productFeed = cloneDeep(productFeedStatusSyncSuccess);
    this.$store.state.campaigns = cloneDeep(conversionTrackingIsTrue);
    this.$store.state.campaigns.campaigns.results.campaigns = cloneDeep(campaigns);
    this.$store.state.campaigns.conversionActions = [{}];
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
  },
});

export const Overview:any = Template.bind({});
Overview.args = {}
