import {PsAccounts} from 'prestashop_accounts_vue_components';
import SectionTitle from '../src/components/onboarding/section-title.vue'
import GoogleAccountCard from '../src/components/google-account/google-account-card.vue'
import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue'
import ProductFeedNotice from '../src/components/onboarding/product-feed-notice.vue'
import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'
import ProductFeedCard from '../src/components/product-feed/product-feed-card.vue'
import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountNotConnected, googleAccountConnected} from "../.storybook/mock/google-account";

export default {
  title: 'Onboarding/OnboardingPage',
};

const TemplatePsAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: `
    <OnboardingPage/>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsNotConnected;
  },
});

export const PsAccount:any = TemplatePsAccount.bind({});
PsAccount.args = {};

const TemplateGoogleAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: `
    <OnboardingPage/>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
  },
});

export const GoogleAccount:any = TemplateGoogleAccount.bind({});
GoogleAccount.args = {};

const TemplateMerchantCenterAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: `
    <OnboardingPage/>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountConnected;
  },
});

export const MerchantCenterAccount:any = TemplateMerchantCenterAccount.bind({});
MerchantCenterAccount.args = {};

const TemplateProductFeed = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    SectionTitle,
    PsAccounts,
    GoogleAccountCard,
    GoogleAdsAccountCard,
    ProductFeedNotice,
    MerchantCenterAccountCard,
    ProductFeedCard,
    FreeListingCard,
  },
  template: `
    <div>
      <SectionTitle
        :is-enabled="true"
        :step-number="1"
        :is-done="true"
        step-title="Your PrestaShop account"
      />
      <PsAccounts
        :context="context"
      />
      <SectionTitle
        :is-enabled="true"
        :step-number="2"
        step-title="Activate your free product listings"
      />
      <ProductFeedNotice />
      <GoogleAccountCard
        :is-enabled="true"
        :is-connected="true"
      />
      <MerchantCenterAccountCard
        :is-connected="true"
        :is-enabled="true"
      />
      <ProductFeedCard
      :is-enabled="true"
      />
      <FreeListingCard
      :is-enabled="false"
      />
      <SectionTitle
        :is-enabled="false"
        :step-number="3"
        step-title="Launch your paid Smart Shopping campaign"
      />
      <GoogleAdsAccountCard
      :is-connected="false"
      />
    </div>
  `,
});

export const ProductFeed:any = TemplateProductFeed.bind({});
ProductFeed.args = {
  context: contextPsAccountsConnectedAndValidated,
};
