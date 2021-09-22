import ProductsPerformanceTable from '../src/components/smart-shopping-campaign/reporting/products-performance/products-performance-table.vue'
import {productsPerformancesSection, productsPerformancesSectionEmpty} from '../.storybook/mock/campaigns-list.js';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';

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
  beforeMount : args.beforeMount,
});

export const ProductsPerformance:any = Template.bind({});
ProductsPerformance.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.productsPerformancesSection = Object.assign({}, productsPerformancesSection);
  },
}

export const EmptyList:any = Template.bind({});
EmptyList.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.productsPerformancesSection = Object.assign([], productsPerformancesSectionEmpty);
  },
}
