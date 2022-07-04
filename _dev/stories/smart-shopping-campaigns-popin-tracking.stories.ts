import SSCPopinActivateTracking from '../src/components/campaigns/ssc-popin-activate-tracking.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {conversionTrackingIsTrue, conversionTrackingIsFalse, conversionTagAlreadyExists} from '../.storybook/mock/campaigns';
export default {
  title: 'Campaign/Popins/Tracking',
    component: SSCPopinActivateTracking,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SSCPopinActivateTracking },
  beforeMount: args.beforeMount,
  mounted: args.mounted,
  template: `
    <div>
      <SSCPopinActivateTracking v-bind="$props" ref="SSCPopinActivateTracking" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const Loading:any = Template.bind({});
Loading.args = {
  visible: true,
  mounted(this: any) {
    this.$refs.SSCPopinActivateTracking.$data.isLoading = true;
    setTimeout(() => {
      this.$refs.SSCPopinActivateTracking.$data.isLoading = true;
    }, 500);
  },
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsTrue);
  },
};

export const TrackingTrue:any = Template.bind({});
TrackingTrue.args = {
  visible: true,
  mounted(this: any) {
    this.$refs.SSCPopinActivateTracking.$data.isLoading = false;
  },
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsTrue);
  },
};

export const TrackingFalse:any = Template.bind({});
TrackingFalse.args = {
  visible: true,
  mounted(this: any) {
    this.$refs.SSCPopinActivateTracking.$data.isLoading = false;
  },
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsFalse);
  },
};

export const TrackingAlreadyExists:any = Template.bind({});
TrackingAlreadyExists.args = {
  visible: true,
  mounted(this: any) {
    this.$refs.SSCPopinActivateTracking.$data.isLoading = false;
  },
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTagAlreadyExists);
  },
};



