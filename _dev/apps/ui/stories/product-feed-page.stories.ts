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

export const SuccessWithoutPrescan:any = ProductFeed.bind({});
SuccessWithoutPrescan.args = {
  beforeMount() {
    this.$store.state.productFeed.report = cloneDeep(productFeedIsConfigured.report);
    this.$store.state.productFeed.report.lastConfigurationUsed.languages = [];
  },
}
SuccessWithoutPrescan.parameters = {
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
    this.$store.state.productFeed.report = cloneDeep(productFeedIsConfigured.report);
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

export const Failed:any = ProductFeed.bind({});
Failed.args = {
  beforeMount() {
    this.$store.state.productFeed.report = cloneDeep(productFeedIsConfigured.report);
  },
}
Failed.parameters = {
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
