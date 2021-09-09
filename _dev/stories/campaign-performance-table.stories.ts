import CampaignPerformanceTable from '../src/components/smart-shopping-campaign/reporting/campaign-performance/campaign-performance-table.vue'

export default {
  title: 'Reporting/Campaign Performance',
  component: CampaignPerformanceTable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignPerformanceTable },
  template: `
    <div>
      <CampaignPerformanceTable v-bind="$props"/>
    </div>
  `,
});

export const CampaignPerformance:any = Template.bind({});
CampaignPerformance.args = {
}
