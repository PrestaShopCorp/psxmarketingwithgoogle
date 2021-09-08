import SSCPopinActivateTracking from '../src/components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {sscDefault, sscTrackingIsFalse, sscTagAlreadyExists} from '../.storybook/mock/smart-shopping-campaigns';
export default {
  title: 'Smart Shopping Campaign/Popins',
    component: SSCPopinActivateTracking,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SSCPopinActivateTracking },
  beforeMount: args.beforeMount,
  template: `
    <div>
      <SSCPopinActivateTracking v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});


export const Activate:any = Template.bind({});
Activate.args = {
  visible: true,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns = Object.assign({}, sscDefault);
  },
};

export const TrackingFalse:any = Template.bind({});
TrackingFalse.args = {
  visible: true,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns = Object.assign({}, sscTrackingIsFalse);
  },
};

export const TrackingAlreadyExists:any = Template.bind({});
TrackingAlreadyExists.args = {
  visible: true,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns = Object.assign({}, sscTagAlreadyExists);
  },
};



