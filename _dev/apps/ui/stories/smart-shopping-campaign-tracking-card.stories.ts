import Campaign from '../src/components/campaigns/campaign-tracking.vue'
import {campaigns} from '../.storybook/mock/campaigns-list';
import {conversionTrackingIsTrue, conversionTrackingIsFalse} from '../.storybook/mock/campaigns';
import cloneDeep from 'lodash.clonedeep';
import {initialStateApp} from "../.storybook/mock/state-app";
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Campaign/Tracking Card',
  component: Campaign,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Campaign },
  template: '<Campaign v-bind="$props" />',
  beforeMount: args.beforeMount || (() => {}),
});


export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.campaigns = cloneDeep(conversionTrackingIsTrue);
    this.$store.state.campaigns.campaigns = cloneDeep(campaigns);
    this.$store.state.campaigns.conversionActions = [{}];
  },
};

export const EnabledWithRemarketingSwitchOff:any = Template.bind({});
EnabledWithRemarketingSwitchOff.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.campaigns = cloneDeep(conversionTrackingIsFalse);
    this.$store.state.campaigns.campaigns = cloneDeep(campaigns);
  },
};

export const AlertAboutMissingConversionActions:any = Template.bind({});
AlertAboutMissingConversionActions.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.campaigns = cloneDeep(conversionTrackingIsTrue);
    this.$store.state.campaigns.campaigns = cloneDeep(campaigns);
    this.$store.state.campaigns.conversionActions = [];
  },
};
