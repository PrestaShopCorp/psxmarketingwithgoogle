import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'
import MerchantCenterAccountPopinDisconnect from '../src/components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import {googleAccountConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import {WebsiteClaimErrorReason} from '../src/store/modules/accounts/state';

export default {
  title: 'Merchant Center Account/Card',
  component: MerchantCenterAccountCard,
  argTypes: {
    error: {
      control: {
        type: 'select',
        // @ts-ignore
        options: [null].concat(Object.keys(WebsiteClaimErrorReason)),
      }
    }
  }
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
    this.$store.state.accounts.googleAccount = googleAccountConnected;
    this.$store.state.accounts.googleMerchantAccount = args.initialMcaStatus;
  },
  methods: {
    fakeConnection(payload) {
      // @ts-ignore
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_ACCOUNT', payload);
      setTimeout(() => {
        // @ts-ignore
        this.$store.commit('accounts/SAVE_WEBSITE_CLAIMING_STATUS', {isClaimed: true, isVerified: true});
      }, 2000);
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
