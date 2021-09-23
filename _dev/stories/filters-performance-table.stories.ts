import FiltersPerformanceTable from '../src/components/smart-shopping-campaign/reporting/filters-performance/filters-performance-table.vue'
import {productsPartitionsPerformancesSection, productsPartitionsPerformancesSectionEmpty} from '../.storybook/mock/campaigns-list.js';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';

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
  beforeMount : args.beforeMount,
});

export const Table:any = Template.bind({});
Table.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.productsPartitionsPerformancesSection = Object.assign({}, productsPartitionsPerformancesSection);
  },
}

export const Empty:any = Template.bind({});
Empty.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.productsPartitionsPerformancesSection = Object.assign({}, productsPartitionsPerformancesSectionEmpty);
  },
}

export const ErrorApi:any = Template.bind({});
ErrorApi.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.errorsList.productsPartitionsPerformancesSection = Object.assign([], true);
  },
}
