import cloneDeep from 'lodash.clonedeep';
import ProductFeedPage from '@/views/product-feed-page.vue'
import {
  productFeedStatusSyncScheduled,
  productFeedSyncSummaryInProgress,
  productFeedStatusSyncSuccess,
  productFeedStatusSyncFailed,
  productFeedIsConfigured,
} from '@/../.storybook/mock/product-feed';
import {
  googleAdsNotChosen,
  adsAccountStatus,
} from '@/../.storybook/mock/google-ads';

import {
  campaignsListResponse,
  campaigns,
} from '@/../.storybook/mock/campaigns-list';

import { rest } from 'msw';
import {
  merchantCenterAccountSuspended,
} from '@/../.storybook/mock/merchant-center-account';
import {RequestState} from '@/store/types';

export default {
  title: 'Product-Feed-Page/Product Feed Page',
};

const ProductFeed = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedPage },
  template: `<ProductFeedPage ref="ProductFeedPage"/>`,
  beforeMount: args.beforeMount,
  mounted: args.mounted,
  beforeCreate(this :any){
    this.$store.state.productFeed.isConfigured = Object.assign({}, true);
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.googleAds.accountChosen.acceptedCustomerDataTerms = true;
  },
});

export const NeedConfiguration:any = ProductFeed.bind({});
NeedConfiguration.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed.isConfigured = false;
  }
};

export const Loading:any = ProductFeed.bind({});
Loading.args = {
  beforeMount() {
    this.$store.state.productFeed.isConfigured = true;
  },
  mounted(this: any) {
    setTimeout(() => {
      this.$store.state.productFeed.warmedUp = RequestState.PENDING;
    }, 500);
  }
}

export const Planned:any = ProductFeed.bind({});
Planned.args = {
  beforeMount() {
    this.$store.state.productFeed.isConfigured = false;
  },
}
Planned.parameters = {
  msw: {
    handlers: [
      rest.get('/incremental-sync/status/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncScheduled.status,
          })
        );
      }),
      rest.get('/incremental-sync/settings/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncScheduled.settings,
          })
        );
      }),
      rest.get('/product-feeds/stats/gmc', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncScheduled.validationSummary
          })
        );
      }),
      rest.get('/ads-accounts/list', (req, res, ctx) => {
        return res(
          ctx.json(
            googleAdsNotChosen.list
          )
        );
      }),
      rest.get('/ads-accounts/status', (req, res, ctx) => {
        return res(
          ctx.json({
            ...adsAccountStatus,
          })
        );
      }),
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsListResponse,
          })
        );
      }),
    ],
  },
};


export const InProgress:any = ProductFeed.bind({});
InProgress.args = {
  allDataLoaded : true,
  beforeMount() {
    this.$store.state.productFeed.isConfigured = false;
    this.$store.state.productFeed.report = cloneDeep(productFeedIsConfigured.report);
  },
}
InProgress.parameters = {
  msw: {
    handlers: [
      rest.get('/incremental-sync/status/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedSyncSummaryInProgress.status,
          })
        );
      }),
      rest.get('/incremental-sync/settings/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedSyncSummaryInProgress.settings,
          })
        );
      }),
      rest.get('/product-feeds/stats/gmc', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedSyncSummaryInProgress.validationSummary
          })
        );
      }),
      rest.get('/ads-accounts/list', (req, res, ctx) => {
        return res(
          ctx.json(
            googleAdsNotChosen.list
          )
        );
      }),
      rest.get('/ads-accounts/status', (req, res, ctx) => {
        return res(
          ctx.json({
            ...adsAccountStatus,
          })
        );
      }),
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsListResponse,
          })
        );
      }),
    ],
  },
};

export const ScanFailedBecauseOfLanguages:any = ProductFeed.bind({});
ScanFailedBecauseOfLanguages.args = {
  beforeMount() {
    this.$store.state.productFeed.report = cloneDeep(productFeedIsConfigured.report);
    this.$store.state.productFeed.report.lastConfigurationUsed.languages = [];
  },
}
ScanFailedBecauseOfLanguages.parameters = {
  msw: {
    handlers: [
      rest.get('/incremental-sync/status/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.status,
          })
        );
      }),
      rest.get('/incremental-sync/settings/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.settings,
          })
        );
      }),
      rest.get('/product-feeds/stats/gmc', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.validationSummary
          })
        );
      }),
      rest.get('/ads-accounts/list', (req, res, ctx) => {
        return res(
          ctx.json(
            googleAdsNotChosen.list
          )
        );
      }),
      rest.get('/ads-accounts/status', (req, res, ctx) => {
        return res(
          ctx.json({
            ...adsAccountStatus,
          })
        );
      }),
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsListResponse,
          })
        );
      }),
    ],
  },
};

export const Success:any = ProductFeed.bind({});
Success.args = {
  beforeMount() {
    this.$store.state.productFeed.report = cloneDeep(productFeedStatusSyncSuccess.report);
  },
}
Success.parameters = {
  msw: {
    handlers: [
      rest.get('/incremental-sync/status/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.status,
          })
        );
      }),
      rest.get('/incremental-sync/settings/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.settings,
          })
        );
      }),
      rest.get('/product-feeds/stats/gmc', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.validationSummary
          })
        );
      }),
      rest.get('/product-feeds/stats/shop', (req, res, ctx) => {
        return res(
          ctx.json({
            totalProducts: productFeedStatusSyncSuccess.report.productsInCatalog
          })
        );
      }),
      rest.get('/ads-accounts/list', (req, res, ctx) => {
        return res(
          ctx.json(
            googleAdsNotChosen.list
          )
        );
      }),
      rest.get('/ads-accounts/status', (req, res, ctx) => {
        return res(
          ctx.json({
            ...adsAccountStatus,
          })
        );
      }),
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsListResponse,
          })
        );
      }),
    ],
  },
};

export const SyncFailed:any = ProductFeed.bind({});
SyncFailed.args = {
  beforeMount() {
    this.$store.state.productFeed.report = cloneDeep(productFeedIsConfigured.report);
  },
}
SyncFailed.parameters = {
  msw: {
    handlers: [
      rest.get('/incremental-sync/status/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncFailed.status,
          })
        );
      }),
      rest.get('/incremental-sync/settings/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncFailed.settings,
          })
        );
      }),
      rest.get('/product-feeds/stats/shop', (req, res, ctx) => {
        return res(
          ctx.json({
            totalProducts: productFeedStatusSyncSuccess.report.productsInCatalog
          })
        );
      }),
      rest.get('/product-feeds/stats/gmc', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncFailed.validationSummary
          })
        );
      }),
      rest.get('/ads-accounts/list', (req, res, ctx) => {
        return res(
          ctx.json(
            googleAdsNotChosen.list
          )
        );
      }),
      rest.get('/ads-accounts/status', (req, res, ctx) => {
        return res(
          ctx.json({
            ...adsAccountStatus,
          })
        );
      }),
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsListResponse,
          })
        );
      }),
    ],
  },
};

export const AccountSuspended:any = ProductFeed.bind({});
AccountSuspended.args = {
  beforeMount() {
    this.$store.state.accounts.googleMerchantAccount = cloneDeep(merchantCenterAccountSuspended);
    this.$store.state.productFeed.report = cloneDeep(productFeedStatusSyncSuccess.report);
  },
}
AccountSuspended.parameters = {
  msw: {
    handlers: [
      rest.get('/incremental-sync/status/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.status,
          })
        );
      }),
      rest.get('/incremental-sync/settings/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.settings,
          })
        );
      }),
      rest.get('/product-feeds/stats/gmc', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.validationSummary
          })
        );
      }),
      rest.get('/product-feeds/stats/shop', (req, res, ctx) => {
        return res(
          ctx.json({
            totalProducts: productFeedStatusSyncSuccess.report.productsInCatalog
          })
        );
      }),
      rest.get('/ads-accounts/list', (req, res, ctx) => {
        return res(
          ctx.json(
            googleAdsNotChosen.list
          )
        );
      }),
      rest.get('/ads-accounts/status', (req, res, ctx) => {
        return res(
          ctx.json({
            ...adsAccountStatus,
          })
        );
      }),
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsListResponse,
          })
        );
      }),
    ],
  },
};

export const EnhancedConversionsNotice:any = ProductFeed.bind({});
EnhancedConversionsNotice.args = {
  beforeMount() {
    this.$store.state.productFeed.report = cloneDeep(productFeedStatusSyncSuccess.report);
    this.$store.state.googleAds.accountChosen.acceptedCustomerDataTerms = false;
    this.$store.state.campaigns.campaigns.results.campaigns = cloneDeep(campaigns);
    this.$store.state.campaigns.campaigns.results.totalCount = 6000;
  },
}
EnhancedConversionsNotice.parameters = {
  msw: {
    handlers: [
      rest.get('/incremental-sync/status/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.status,
          })
        );
      }),
      rest.get('/incremental-sync/settings/*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.settings,
          })
        );
      }),
      rest.get('/product-feeds/stats/gmc', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.validationSummary
          })
        );
      }),
      rest.get('/product-feeds/stats/shop', (req, res, ctx) => {
        return res(
          ctx.json({
            totalProducts: productFeedStatusSyncSuccess.report.productsInCatalog
          })
        );
      }),
      rest.get('/ads-accounts/list', (req, res, ctx) => {
        return res(
          ctx.json(
            googleAdsNotChosen.list
          )
        );
      }),
      rest.get('/ads-accounts/status', (req, res, ctx) => {
        return res(
          ctx.json({
            ...adsAccountStatus,
          })
        );
      }),
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsListResponse,
          })
        );
      }),
    ],
  },
};
