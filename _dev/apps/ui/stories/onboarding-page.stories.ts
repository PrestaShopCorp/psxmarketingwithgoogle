import cloneDeep from 'lodash.clonedeep';
import OnboardingPage from '@/views/onboarding-page.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {productFeedIsConfiguredOnce, productFeedIsConfigured} from '../.storybook/mock/product-feed';
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {contextPsEventBus} from "../.storybook/mock/ps-event-bus";
import {googleAccountNotConnected, googleAccountConnected, googleAccountConnectedOnce} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected, merchantCenterAccountConnectedOnce} from "../.storybook/mock/merchant-center-account";
import {googleAdsAccountChosen, adsAccountStatus, googleAdsAccountChosenWithSignedTos} from "../.storybook/mock/google-ads";
import {conversionTrackingIsFalse, conversionTrackingIsTrue, enhancedConversionsTrackingIsTrue} from '../.storybook/mock/campaigns';
import {campaigns as campaignsMock} from '../.storybook/mock/campaigns-list';
import {State as CampaignState} from '@/store/modules/campaigns/state';

export default {
  title: 'Onboarding/OnboardingPage',
};

const TemplatePsAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: `<OnboardingPage/>`,
  beforeMount: args.beforeMount,

});

export const PsAccount:any = TemplatePsAccount.bind({});
PsAccount.args = {
  beforeMount: function(this: any) {
    window.contextPsAccounts = Object.assign({}, contextPsAccountsNotConnected);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsNotConnected);
  }
};

export const GoogleAccount:any = TemplatePsAccount.bind({});
GoogleAccount.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountNotConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountNotConnected);
  },
};

export const MerchantCenterAccount:any = TemplatePsAccount.bind({});
MerchantCenterAccount.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnectedOnce);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountNotConnected);
  },
};

export const ProductFeed:any = TemplatePsAccount.bind({});
ProductFeed.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnectedOnce);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
  },
};

export const FreeListing:any = TemplatePsAccount.bind({});
FreeListing.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
  },
};

export const GoogleAds:any = TemplatePsAccount.bind({});
GoogleAds.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
    this.$store.state.googleAds = Object.assign({}, adsAccountStatus);
  },
};

export const campaigns:any = TemplatePsAccount.bind({});
campaigns.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
    this.$store.state.googleAds = Object.assign({}, adsAccountStatus);
  },
};

export const Tracking:any = TemplatePsAccount.bind({});
Tracking.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
    this.$store.state.googleAds = Object.assign({}, adsAccountStatus);
    (this.$store.state.campaigns as CampaignState) = cloneDeep(conversionTrackingIsFalse);
    (this.$store.state.campaigns as CampaignState).campaigns.results.campaigns = cloneDeep(campaignsMock);
    (this.$store.state.campaigns as CampaignState).campaigns.results.totalCount = 40;
  },
};

export const Completed:any = TemplatePsAccount.bind({});
Completed.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.contextPsEventBus = Object.assign({}, contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosenWithSignedTos);
    (this.$store.state.campaigns as CampaignState) = cloneDeep(enhancedConversionsTrackingIsTrue);
    (this.$store.state.campaigns as CampaignState).campaigns.results.campaigns = cloneDeep(campaignsMock);
    (this.$store.state.campaigns as CampaignState).campaigns.results.totalCount = 40;
  },
};
