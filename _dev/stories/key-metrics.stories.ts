import KeyMetricsBlock from '../src/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue'

export default {
  title: 'Reporting/Key Metrics',
  component: KeyMetricsBlock,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { KeyMetricsBlock },
  template: `
    <div>
      <KeyMetricsBlock v-bind="$props"/>
    </div>
  `,
});

export const KeyMetrics:any = Template.bind({});
KeyMetrics.args = {
}
