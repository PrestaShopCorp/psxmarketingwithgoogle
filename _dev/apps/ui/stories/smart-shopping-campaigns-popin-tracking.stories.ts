import TrackingActivationModal from '../src/components/campaigns/tracking-activation-modal.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {conversionTrackingIsTrue} from '../.storybook/mock/campaigns';
export default {
  title: 'Campaign/Popins',
    component: TrackingActivationModal,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TrackingActivationModal },
  beforeMount: args.beforeMount,
  mounted: args.mounted,
  template: `
    <div>
      <TrackingActivationModal v-bind="$props" ref="TrackingActivationModal" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const Tracking:any = Template.bind({});
Tracking.args = {
  visible: true,
  beforeMount(this: any) {
    this.$store.state.campaigns = Object.assign({}, conversionTrackingIsTrue);
  },
};


