import FiltersPerformanceTable from '../src/components/smart-shopping-campaign/reporting/filters-performance/filters-performance-table.vue'

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
});

export const FiltersPerformance:any = Template.bind({});
FiltersPerformance.args = {
}
