import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'
import MerchantCenterAccountPopinDisconnect from '../src/components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import {googleAccountConnected} from "../.storybook/mock/google-account";
import {
  merchantCenterAccountNotConnected,
  merchantCenterAccountConnected,
  merchandCenterAccountNotConnectedWithOverwriteClaim,
  merchandCenterAccountNotConnectedWithExpiringError,
  merchandCenterAccountNotConnectedWithPendingStatus,
  merchandCenterAccountNotConnectedWithDisapprovedStatus,
  merchandCenterAccountNotConnectedWithShopInfoMissing,
} from "../.storybook/mock/merchant-center-account";
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
  initialMcaStatus: merchantCenterAccountNotConnected,
};

export const EnabledNotConnected:any = Template.bind({});
EnabledNotConnected.args = {
  isEnabled: true,
  initialMcaStatus: merchantCenterAccountNotConnected,
};

export const EnableWithOverrideClaim:any = Template.bind({});
EnableWithOverrideClaim.args = {
  isEnabled: true,
  initialMcaStatus: merchandCenterAccountNotConnectedWithOverwriteClaim,
};

export const EnableWithClaimDisapproved:any = Template.bind({});
EnableWithClaimDisapproved.args = {
  isEnabled: true,
  initialMcaStatus: merchandCenterAccountNotConnectedWithDisapprovedStatus,
};

export const EnableWithExpiringError:any = Template.bind({});
EnableWithExpiringError.args = {
  isEnabled: true,
  initialMcaStatus: merchandCenterAccountNotConnectedWithExpiringError,
};

export const EnableAndShopInfoMissing:any = Template.bind({});
EnableAndShopInfoMissing.args = {
  isEnabled: true,
  initialMcaStatus: merchandCenterAccountNotConnectedWithShopInfoMissing,
};

export const EnabledConnected:any = Template.bind({});
EnabledConnected.args = {
  isEnabled: true,
  initialMcaStatus: merchantCenterAccountConnected,
};
