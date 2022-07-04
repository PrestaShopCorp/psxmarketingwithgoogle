import Campaign from '../src/components/campaigns/campaign-card.vue'
import {campaigns} from '../.storybook/mock/campaigns-list.js';
import {conversionTrackingIsTrue, conversionTrackingIsFalse} from '../.storybook/mock/campaigns';

export default {
  title: 'Campaign/Card',
  component: Campaign,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Campaign },
  template: '<Campaign v-bind="$props" />',
  beforeMount: args.beforeMount || (() => {}),
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  loading: false,
};

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  loading: false,
};

export const EnabledWithRemarketingSwitchOff:any = Template.bind({});
EnabledWithRemarketingSwitchOff.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsFalse);
    this.$store.state.campaigns.campaigns = Object.assign([], campaigns);
  },
};

export const EnabledWithRemarketingSwitchOn:any = Template.bind({});
EnabledWithRemarketingSwitchOn.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsTrue);
    this.$store.state.campaigns.campaigns = Object.assign([], campaigns);
    this.$store.state.campaigns.conversionActions = [{}];
  },
};

export const AlertAboutMissingConversionActions:any = Template.bind({});
AlertAboutMissingConversionActions.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsTrue);
    this.$store.state.campaigns.campaigns = Object.assign([], campaigns);
    this.$store.state.campaigns.conversionActions = [];
  },
};
