import SyncOverview from '../src/components/product-feed-page/sync-overview.vue';
import {googleAccountConnected} from '../.storybook/mock/google-account';
import {
  productFeedStatusSyncSuccess,
} from '../.storybook/mock/product-feed';
import GoogleAdsAccountPopinNew from '../src/components/google-ads-account/google-ads-account-popin-new.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {initialStateApp} from "../.storybook/mock/state-app";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';
import BannerAds from '../src/components/commons/banner-ads.vue'
import BannerCampaigns from '../src/components/commons/banner-campaigns.vue'
import SmartShoppingCampaignCreationPopin from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue'
import SmartShoppingCampaignsList from '../src/components/smart-shopping-campaign/smart-shopping-campaign-table-list.vue'
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

// const TemplateAdsConfigurationPage = (args, { argTypes }) => ({
//   props: Object.keys(argTypes),
//   components: { OnboardingPage, BannerAds},
//   template: `
//     <div>
//       <OnboardingPage v-bind="$props" 
     
//       />
//       <BannerAds/>
//     </div>
//   `,
//   beforeMount: args.beforeMount,
// });


// export const BannerOnConfigurationPage:any = TemplateAdsConfigurationPage.bind({});
// BannerOnConfigurationPage.args = {
  
// };

const TemplateCampaignsCreation = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreationPopin, BannerAds},
  template: `
  <div>
  <SmartShoppingCampaignCreationPopin v-bind="$props"/>
  </div>
  `,
  beforeMount: args.beforeMount,
});
export const BannerOnCreationCampaign:any = TemplateCampaignsCreation.bind({});
BannerOnCreationCampaign.args = {
};


const TemplateCampaignsList = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignsList, BannerCampaigns},
  template: `
  <div>
  <BannerCampaigns/>
  <SmartShoppingCampaignsList v-bind="$props"/>
  </div>
  `,
  beforeMount: args.beforeMount,
});

export const BannerOnCampaignsListPage:any = TemplateCampaignsList.bind({});
BannerOnCampaignsListPage.args = {
 
};
