import CampaignsPerformanceTable from '../src/components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
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
});

export const CampaignsPerformance:any = Template.bind({});
CampaignsPerformance.args = {
}
