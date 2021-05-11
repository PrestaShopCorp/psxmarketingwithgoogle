import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";

export default {
  title: 'Merchant Center Account/Card',
  component: MerchantCenterAccountCard,
  argTypes: {
    error: {
      control: {
        type: 'select',
        options: [null, 'disapproved', 'expiring', 'pending', 'overwrite'],
      }
    }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountCard },
  template: `<MerchantCenterAccountCard 
      v-bind="$props" 
      @selectMerchantCenterAccount="fakeConnection"
      @dissociateMerchantCenterAccount="onMerchantCenterAccountDissociated"
    />`,
  beforeMount(this: any) {
    this.$store.state.accounts.googleMerchantAccount = args.initialMcaStatus;
  },
  methods: {
    fakeConnection(payload) {
      // @ts-ignore
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_ACCOUNT', payload);
    },
    onMerchantCenterAccountDissociated() {
      // @ts-ignore
      this.$store.commit('accounts/REMOVE_MCA_ACCOUNT');
    },
  }
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  error: null,
  initialMcaStatus: merchantCenterAccountNotConnected,
};

export const EnabledNotConnected:any = Template.bind({});
EnabledNotConnected.args = {
  isEnabled: true,
  error: null,
  initialMcaStatus: merchantCenterAccountNotConnected,
};

export const EnabledConnected:any = Template.bind({});
EnabledConnected.args = {
  isEnabled: true,
  error: null,
  initialMcaStatus: merchantCenterAccountConnected,
};
