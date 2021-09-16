import KeyMetricsBlock from '../src/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue'
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads.js';

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
  beforeMount: args.beforeMount
});

export const KeyMetrics:any = Template.bind({});
KeyMetrics.args = {
  beforeMount(this: any) {
      this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  }
}
