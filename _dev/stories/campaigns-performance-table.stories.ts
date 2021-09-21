import CampaignsPerformanceTable from '../src/components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
import {campaignsPerformanceList} from '../.storybook/mock/campaigns-list.js';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';

export default {
  title: 'Reporting/Campaigns Performance',
  component: CampaignsPerformanceTable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignsPerformanceTable },
  template: `
    <div>
      <CampaignsPerformanceTable v-bind="$props"/>
    </div>
  `,
  beforeMount : args.beforeMount,
});

export const CampaignsPerformance:any = Template.bind({});
CampaignsPerformance.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.campaignsPerformancesSection.campaignsPerformanceList = Object.assign({}, campaignsPerformanceList);
    this.$store.state.smartShoppingCampaigns.reporting.results.campaignsPerformancesSection.nextPageToken = Object.assign({}, 'fooBar');
  },
}
