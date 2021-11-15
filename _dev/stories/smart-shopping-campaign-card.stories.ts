import SmartShoppingCampaign from '../src/components/smart-shopping-campaigns/smart-shopping-campaign-card.vue'
import {campaigns} from '../.storybook/mock/campaigns-list.js';
import {sscTrackingIsTrue, sscTrackingIsFalse} from '../.storybook/mock/smart-shopping-campaigns';

export default {
  title: 'Smart Shopping Campaign/Card',
  component: SmartShoppingCampaign,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaign },
  template: '<SmartShoppingCampaign v-bind="$props" />',
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
    this.$store.state.smartShoppingCampaigns = Object.assign({}, sscTrackingIsFalse);
    this.$store.state.smartShoppingCampaigns.campaigns = Object.assign([], campaigns);
  },
};

export const EnabledWithRemarketingSwitchOn:any = Template.bind({});
EnabledWithRemarketingSwitchOn.args = {
  isEnabled: true,
    loading: false,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns = Object.assign({}, sscTrackingIsTrue);
    this.$store.state.smartShoppingCampaigns.campaigns = Object.assign([], campaigns);
    this.$store.state.smartShoppingCampaigns.conversionActions = [{}];
  },
};

export const AlertAboutMissingConversionActions:any = Template.bind({});
AlertAboutMissingConversionActions.args = {
  isEnabled: true,
    loading: false,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns = Object.assign({}, sscTrackingIsTrue);
    this.$store.state.smartShoppingCampaigns.campaigns = Object.assign([], campaigns);
    this.$store.state.smartShoppingCampaigns.conversionActions = [];
  },
};
