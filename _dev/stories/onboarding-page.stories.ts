import SectionTitle from '../src/components/onboarding/section-title.vue'
import PsAccountCard from '../src/components/ps-account/ps-account-card.vue'
import GoogleAccountCard from '../src/components/google-account/google-account-card.vue'
import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue'
import ProductFeedNotice from '../src/components/onboarding/product-feed-notice.vue'
import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'
import ProductFeedCard from '../src/components/product-feed/product-feed-card.vue'
import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'

export default {
  title: 'Onboarding/OnboardingPage',
};

const TemplatePsAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SectionTitle, PsAccountCard, GoogleAccountCard, GoogleAdsAccountCard, },
  template: `
    <div>
      <SectionTitle
        :is-enabled="true"
        :step-number="1"
        step-title="Your PrestaShop account"
      />
      <PsAccountCard
        :is-connected="false"
      />
      <SectionTitle
        :is-enabled="false"
        :step-number="2"
        step-title="Activate your free product listings"
      />
      <GoogleAccountCard
        :is-enabled="false"
        :is-connected="false"
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

export const PsAccount:any = TemplatePsAccount.bind({});
PsAccount.args = {};

const TemplateGoogleAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    SectionTitle,
    PsAccountCard,
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
      <PsAccountCard
        :is-connected="true"
      />
      <SectionTitle
        :is-enabled="true"
        :step-number="2"
        step-title="Activate your free product listings"
      />
      <ProductFeedNotice />
      <GoogleAccountCard
        :is-enabled="true"
        :is-connected="false"
      />
      <MerchantCenterAccountCard
        :is-connected="false"
        :is-enabled="false"
      />
      <ProductFeedCard
      :is-enabled="false"
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

export const GoogleAccount:any = TemplateGoogleAccount.bind({});
GoogleAccount.args = {};

const TemplateMerchantCenterAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    SectionTitle,
    PsAccountCard,
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
      <PsAccountCard
        :is-connected="true"
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
        :is-connected="false"
        :is-enabled="true"
      />
      <ProductFeedCard
      :is-enabled="false"
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

export const MerchantCenterAccount:any = TemplateMerchantCenterAccount.bind({});
MerchantCenterAccount.args = {};

const TemplateProductFeed = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    SectionTitle,
    PsAccountCard,
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
      <PsAccountCard
        :is-connected="true"
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
ProductFeed.args = {};
