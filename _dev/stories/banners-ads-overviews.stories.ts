import {googleAccountConnected} from '../.storybook/mock/google-account';
import {conversionTrackingIsTrue} from '../.storybook/mock/campaigns';
import {campaigns} from '../.storybook/mock/campaigns-list.js';
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {initialStateApp} from "../.storybook/mock/state-app";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {googleAdsAccountChosen, adsAccountStatus} from '../.storybook/mock/google-ads';
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';
import BannerAds from '../src/components/commons/banner-ads.vue'
import BannerCampaigns from '../src/components/commons/banner-campaigns.vue'
import CampaignCreationPopin from '../src/components/campaign-creation/campaign-creation.vue'
import GoogleAdsAccountPopinNew from '../src/components/google-ads-account/google-ads-account-popin-new.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import campaignsList from '../src/components/campaign/campaign-table-list.vue'
export default {
  title: 'Basic Components/Banners/Overviews',
  component: GoogleAdsAccountPopinNew,BannerAds,
  parameters: {
    jest: ['product-feed-card-report-products-sync-card.spec.ts'],
  },
};

const TemplateAdsPopinNewGoogleAdsAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountPopinNew},
  template: `
    <div>
      <GoogleAdsAccountPopinNew v-bind="$props" 
      ref="googleAdsAccountPopin"
      />
    </div>
  `,
  beforeMount: args.beforeMount,
});
export const BannerOnPopinNewAdsAccount:any = TemplateAdsPopinNewGoogleAdsAccount.bind({});
BannerOnPopinNewAdsAccount.args = {
  visible: true,
  stepActive: 3,
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

const TemplateAdsConfigurationPage = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage},
  template: `
  <div>
  <OnboardingPage v-bind="$props"/>
  </div>
  `,
  beforeMount: args.beforeMount,
  mounted: args.mounted,
  user: Object.assign({}, googleAccountConnected),
  beforeCreate(this:any){
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsTrue);
    this.$store.state.campaigns.campaigns = Object.assign([], campaigns);
    this.$store.state.campaigns.conversionActions = [{}];
    this.$store.state.googleAds = Object.assign({}, adsAccountStatus);
  }
});

export const BannerOnConfigurationPage:any = TemplateAdsConfigurationPage.bind({});
BannerOnConfigurationPage.args = {
  isEnabled: true
};

const TemplateCampaignsCreation = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignCreationPopin},
  template: `
  <div>
  <CampaignCreationPopin v-bind="$props"  ref="bannerAds"/>
  </div>
  `,
  beforeMount: args.beforeMount,
  mounted: args.mounted,
});
export const BannerOnCreationCampaign:any = TemplateCampaignsCreation.bind({});
BannerOnCreationCampaign.args = {
  mounted(this: any) {
  this.$refs.bannerAds.$data.isBanner = true
  }

};


const TemplateCampaignsList = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { campaignsList, BannerCampaigns},
  template: `
  <div>
  <campaignsList v-bind="$props"/>
  </div>
  `,
  beforeMount: args.beforeMount,
});

export const BannerOnCampaignsListPage:any = TemplateCampaignsList.bind({});
BannerOnCampaignsListPage.args = {
  beforeMount() {
    this.$store.state.campaigns.campaigns = Object.assign([], []);
  },
  loading: false, 
};
