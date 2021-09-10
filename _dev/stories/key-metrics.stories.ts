import KeyMetricsCard from '../src/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-card.vue'

export default {
  title: 'Reporting/Key Metrics',
  component: KeyMetricsCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { KeyMetricsCard },
  template: `
    <div>
      <KeyMetricsCard v-bind="$props"/>
    </div>
  `,
});

export const KeyMetrics:any = Template.bind({});
KeyMetrics.args = {
}
