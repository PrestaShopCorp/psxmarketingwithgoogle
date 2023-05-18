import cloneDeep from 'lodash.clonedeep';
import ProductFeedPage from '../src/views/product-feed-page.vue'
import {
  productFeed,
  productFeedStatusSyncScheduled,
  productFeedSyncSummaryInProgress,
  productFeedStatusSyncSuccess,
  productFeedStatusSyncFailed,
  productFeedIsConfigured,
} from '../.storybook/mock/product-feed';
import {
  googleAdsNotChosen,
  adsAccountStatus,
} from '../.storybook/mock/google-ads';

import {
  campaignsListResponse
} from '../.storybook/mock/campaigns-list';

import { rest } from 'msw';
import merchantCenterAccountConnected from '../.storybook/mock/merchant-center-account';

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
      this.$refs.ProductFeedPage.$data.allDataLoaded = false;
    }, 500);
  }
}

export const Planned:any = ProductFeed.bind({});
Planned.args = {
  beforeMount() {
    this.$store.state.productFeed.isConfigured = false;
  },
  mounted(this: any) {
    this.$refs.ProductFeedPage.$data.allDataLoaded = true
  }
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
      rest.get('/product-feeds/validation/summary', (req, res, ctx) => {
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
      rest.get('/product-feeds/prevalidation-scan/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeed.prevalidationScanSummary
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
  mounted(this: any) {
    this.$refs.ProductFeedPage.$data.allDataLoaded = true
  }
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
      rest.get('/product-feeds/validation/summary', (req, res, ctx) => {
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
      rest.get('/product-feeds/prevalidation-scan/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeed.prevalidationScanSummary
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
      rest.get('/product-feeds/validation/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.validationSummary
          })
        );
      }),
      rest.get('/product-feeds/prevalidation-scan/summary', (req, res, ctx) => {
        return res(
          ctx.status(409)
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
      rest.get('/product-feeds/validation/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.validationSummary
          })
        );
      }),
      rest.get('/product-feeds/prevalidation-scan/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeed.prevalidationScanSummary
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
      rest.get('/product-feeds/validation/summary', (req, res, ctx) => {
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
      rest.get('/product-feeds/prevalidation-scan/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeed.prevalidationScanSummary
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
    this.$store.state.accounts.googleMerchantAccount = cloneDeep(Object.assign({},
      merchantCenterAccountConnected,
      {
        isSuspended: {
          status: true,
          issues: [
            {
              id: 'editorial_and_professional_standards_destination_url_down_policy',
              title:
                'Account suspended due to policy violation: landing page not working',
              country: 'US',
              severity: 'critical',
              documentation:
                'https://google.com/first-link',
            },
            {
              id: 'editorial_and_professional_standards_destination_url_down_policy',
              title:
                'Account suspended due to policy violation: Oh no',
              country: 'US',
              severity: 'critical',
              documentation:
                'https://google.com/second-link',
            },
          ]
        },
      },
    ));
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
      rest.get('/product-feeds/validation/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeedStatusSyncSuccess.validationSummary
          })
        );
      }),
      rest.get('/product-feeds/prevalidation-scan/summary', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productFeed.prevalidationScanSummary
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
