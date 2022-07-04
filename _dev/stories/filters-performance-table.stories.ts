import FiltersPerformanceTable from '../src/components/campaign/reporting/filters-performance/filters-performance-table.vue'
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {rest} from 'msw';
import {productsPartitionsPerformanceListEmpty, productsPartitionsPerformanceList} from '../.storybook/mock/reporting/products-partitions-performance.js';
import {nextPageTokenEmpty, nextPageToken} from '../.storybook/mock/reporting/next-page-token.js';

export default {
  title: 'Reporting/Filters Performance',
  component: FiltersPerformanceTable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FiltersPerformanceTable },
  template: `
    <div>
      <FiltersPerformanceTable v-bind="$props"/>
    </div>
  `,
  beforeMount: args.beforeMount,
});

export const Table:any = Template.bind({});
Table.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
}

Table.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/products-partitions-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPartitionsPerformanceList,
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
      rest.get('/ads-reporting/products-partitions-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPartitionsPerformanceListEmpty,
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
  },
}

ErrorApi.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/products-partitions-performances', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};
