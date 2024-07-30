import {rest} from 'msw';
import cloneDeep from 'lodash.clonedeep';
import OnboardingPage from '@/views/onboarding-page.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {productFeedIsConfiguredOnce, productFeedIsConfigured} from '../.storybook/mock/product-feed';
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {contextPsEventBus} from "../.storybook/mock/ps-event-bus";
import {contextPsBilling, runningSubscription, trialNotRenewedSubscription} from "@/../.storybook/mock/ps-billing";
import {googleAccountNotConnected, googleAccountConnected, googleAccountConnectedOnce} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected, merchantCenterAccountConnectedOnce} from "../.storybook/mock/merchant-center-account";
import {adsAccountStatus, googleAdsAccountChosenWithSignedTos} from "../.storybook/mock/google-ads";
import {conversionTrackingIsTrue, enhancedConversionsTrackingIsTrue} from '../.storybook/mock/campaigns';
import {campaigns as campaignsMock} from '../.storybook/mock/campaigns-list';
import {State as CampaignState} from '@/store/modules/campaigns/state';

export default {
  title: 'Onboarding/OnboardingPage',
};

const TemplatePsAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: `<OnboardingPage ref="page" />`,
  beforeMount: args.beforeMount,
  mounted: args.mounted,
});

export const PsAccount:any = TemplatePsAccount.bind({});
PsAccount.args = {
  beforeMount: function(this: any) {
    window.contextPsAccounts = Object.assign({}, contextPsAccountsNotConnected);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsNotConnected);
    window.psBillingContext = undefined;
    this.$store.state.app.billing.subscription = undefined;
  }
};

export const BillingStep:any = TemplatePsAccount.bind({});
BillingStep.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = undefined;
  }
}

export const GoogleAccount:any = TemplatePsAccount.bind({});
GoogleAccount.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      initialStateApp
    );
    window.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = runningSubscription;
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountNotConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountNotConnected);
  },
  mounted: function (this: any) {
    this.$refs.page.$data.cloudSyncSharingConsentGiven = true;
  },
};
GoogleAccount.parameters = {
  msw: {
    handlers: [
      rest.get('/oauth', (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            "statusCode": 404,
            "message": "Google account not found!",
            "error": "{\"shopId\":\"foobar\",\"correlationId\":\"foobar2\"}"
          })
        );
      }),
      rest.get('/oauth/authorized-url', (req, res, ctx) => {
        return res(
          ctx.json({
            "authorizedUrl": "https://accounts.google.com/o/oauth2/v2/auth?foobar"
          })
        );
      }),
    ],
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
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = runningSubscription;
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnectedOnce);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountNotConnected);
  },
  mounted: function (this: any) {
    this.$refs.page.$data.cloudSyncSharingConsentGiven = true;
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
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = runningSubscription;
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnectedOnce);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
  },
  mounted: function (this: any) {
    this.$refs.page.$data.cloudSyncSharingConsentGiven = true;
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
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = runningSubscription;
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
  },
  mounted: function (this: any) {
    this.$refs.page.$data.cloudSyncSharingConsentGiven = true;
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
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = runningSubscription;
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
    this.$store.state.googleAds = Object.assign({}, adsAccountStatus);
  },
  mounted: function (this: any) {
    this.$refs.page.$data.cloudSyncSharingConsentGiven = true;
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
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = runningSubscription;
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
    this.$store.state.googleAds = Object.assign({}, adsAccountStatus);
  },
  mounted: function (this: any) {
    this.$refs.page.$data.cloudSyncSharingConsentGiven = true;
  },
};

export const Tracking:any = TemplatePsAccount.bind({});
Tracking.args = {
  beforeMount(this: any) {
    localStorage.clear();
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
    (this.$store.state.campaigns as CampaignState) = cloneDeep(conversionTrackingIsTrue);
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
    window.psBillingContext = cloneDeep(contextPsBilling);
    window.contextPsEventbus = Object.assign({}, contextPsEventBus);
    this.$store.state.app.billing.subscription = runningSubscription;
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfiguredOnce);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosenWithSignedTos);
    (this.$store.state.campaigns as CampaignState) = cloneDeep(enhancedConversionsTrackingIsTrue);
    (this.$store.state.campaigns as CampaignState).campaigns.results.campaigns = cloneDeep(campaignsMock);
    (this.$store.state.campaigns as CampaignState).campaigns.results.totalCount = 40;
  },
  mounted: function (this: any) {
    this.$refs.page.$data.cloudSyncSharingConsentGiven = true;
  },
};
