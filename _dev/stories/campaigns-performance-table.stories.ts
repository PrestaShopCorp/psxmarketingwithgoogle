import CampaignsPerformanceTable from '../src/components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
import {campaignsPerformanceSection, campaignsPerformanceSectionEmpty} from '../.storybook/mock/campaigns-list.js';
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
  beforeMount: args.beforeMount,
});

export const Table:any = Template.bind({});
Table.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.campaignsPerformancesSection = Object.assign({}, campaignsPerformanceSection);
  },
}

export const Empty:any = Template.bind({});
Empty.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.campaignsPerformancesSection = Object.assign([], campaignsPerformanceSectionEmpty);
  },
}

export const ErrorApi:any = Template.bind({});
ErrorApi.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.errorsList.campaignsPerformancesSection = Object.assign([], true);
  },
}
