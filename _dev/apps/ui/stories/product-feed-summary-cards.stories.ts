import ProductFeedSummaryCards from "../src/components/product-feed/summary/product-feed-summary-cards.vue";
import { initialStateApp } from "../.storybook/mock/state-app";
import { productFeed } from "../.storybook/mock/product-feed";
import {State as ProductFeedState} from '@/store/modules/product-feed/state';

export default {
  title: 'Basic Components/Summary Cards',
  component: ProductFeedSummaryCards,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSummaryCards },
  template:
    '<div><ProductFeedSummaryCards v-bind="$props"/></div>',
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    (this.$store.state.productFeed as ProductFeedState) = Object.assign({}, productFeed);
    (this.$store.state.productFeed as ProductFeedState).gmcProductsByStatus.results.disapproved = [];
  },
  mounted(this: any) {
    if (args.loading === true) {
      this.$refs.testTable.$data.loading = true;
    }
  },
});

export const SummaryCards: any = Template.bind({});

