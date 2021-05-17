import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'
import MerchantCenterAccountPopinDisconnect from '../src/components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";

export default {
  title: 'Merchant Center Account/Card',
  component: MerchantCenterAccountCard,
  argTypes: {
    error: {
      control: {
        type: 'select',
        options: [null, 'disapproved', 'expiring', 'pending', 'overwrite', 'shopinfomissing'],
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountCard, MerchantCenterAccountPopinDisconnect },
  template: `
    <div>
      <MerchantCenterAccountCard
        v-bind="$props"
        @selectMerchantCenterAccount="fakeConnection"
        @dissociateMerchantCenterAccount="onMerchantCenterAccountDissociated"
      />
      <MerchantCenterAccountPopinDisconnect
        ref="mcaDisconnectModal"
      />
    </div>`,
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
      this.$bvModal.show(
        // @ts-ignore
        this.$refs.mcaDisconnectModal.$refs.modal.id,
      );
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
