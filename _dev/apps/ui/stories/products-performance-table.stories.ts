import {dateGenerator} from '../.storybook/utils/date-generator';
import ProductsPerformanceTable from '../src/components/campaign/reporting/products-performance/products-performance-table.vue'
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {rest} from 'msw';
import {productsPerformanceListEmpty, productsPerformanceList} from '../.storybook/mock/reporting/products-performance';
import {nextPageTokenEmpty, nextPageToken} from '../.storybook/mock/reporting/next-page-token';

export default {
  title: 'Reporting/Products Performance',
  component: ProductsPerformanceTable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductsPerformanceTable },
  template: `
    <div>
      <ProductsPerformanceTable v-bind="$props"/>
    </div>
  `,
  beforeMount: args.beforeMount,
});

export const Table:any = Template.bind({});
Table.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(6);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
}

Table.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/products-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPerformanceList,
            ...nextPageToken,
          })
        );
      }),
    ],
  },
};

export const Empty:any = Template.bind({});
Empty.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
}

Empty.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/products-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPerformanceListEmpty,
            ...nextPageTokenEmpty,
          })
        );
      }),
    ],
  },
};


export const ErrorApi:any = Template.bind({});
ErrorApi.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return api error
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(1);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);  },
}

ErrorApi.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/products-performances', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};
