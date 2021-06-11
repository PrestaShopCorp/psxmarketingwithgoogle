import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue';
import MerchantCenterAccountPopinDisconnect from '../src/components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import {initialStateApp} from '../.storybook/mock/state-app';
import {googleAccountConnected} from '../.storybook/mock/google-account';
import {
  merchantCenterAccountNotConnected,
  merchantCenterAccountConnected,
} from '../.storybook/mock/merchant-center-account';
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
      },
    },
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {MerchantCenterAccountCard, MerchantCenterAccountPopinDisconnect},
  template: `
    <div>
      <MerchantCenterAccountCard
        v-bind="$props"
        @selectMerchantCenterAccount="fakeConnection($event)"
        @dissociateMerchantCenterAccount="onMerchantCenterAccountDissociated"
      />
      <MerchantCenterAccountPopinDisconnect
        ref="mcaDisconnectModal"
      />
    </div>`,
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.googleAccount = googleAccountConnected;
    this.$store.state.accounts.googleMerchantAccount = args.initialMcaStatus;
  },
  methods: {
    fakeConnection(selectedAccount) {
      // @ts-ignore
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_ACCOUNT', {selectedAccount, correlationId: ''});
      setTimeout(() => {
        // @ts-ignore
        this.$store.commit('accounts/SAVE_WEBSITE_VERIFICATION_AND_CLAIMING_STATUS', {isClaimed: true, isVerified: true});
      }, 2000);
    },
    onMerchantCenterAccountDissociated() {
      // @ts-ignore
      this.$bvModal.show(
        // @ts-ignore
        this.$refs.mcaDisconnectModal.$refs.modal.id,
      );
    },
  },
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

export const ConnectedWithOverrideClaim:any = Template.bind({});
ConnectedWithOverrideClaim.args = {
  isEnabled: true,
  initialMcaStatus: {
    ...merchantCenterAccountConnected,
    claimError: WebsiteClaimErrorReason.Overwrite,
  },
};

export const ConnectedWithClaimDisapproved:any = Template.bind({});
ConnectedWithClaimDisapproved.args = {
  isEnabled: true,
  initialMcaStatus: {
    ...merchantCenterAccountConnected,
    claimError: WebsiteClaimErrorReason.Expiring,
  },
};

export const ConnectedWithExpiringError:any = Template.bind({});
ConnectedWithExpiringError.args = {
  isEnabled: true,
  initialMcaStatus: {
    ...merchantCenterAccountConnected,
    claimError: WebsiteClaimErrorReason.Disapproved,
  },
};

export const ConnectedAndShopInfoMissing:any = Template.bind({});
ConnectedAndShopInfoMissing.args = {
  isEnabled: true,
  initialMcaStatus: {
    ...merchantCenterAccountConnected,
    claimError: WebsiteClaimErrorReason.ShopInfoMissing,
  },
};

export const ConnectedButVerifyOrClaimingFailed:any = Template.bind({});
ConnectedButVerifyOrClaimingFailed.args = {
  isEnabled: true,
  initialMcaStatus: {
    ...merchantCenterAccountConnected,
    claimError: WebsiteClaimErrorReason.VerifyOrClaimingFailed,
  },
};

export const EnabledConnected:any = Template.bind({});
EnabledConnected.args = {
  isEnabled: true,
  initialMcaStatus: merchantCenterAccountConnected,
};

export const EnabledLinkingFailed:any = Template.bind({});
EnabledLinkingFailed.args = {
  isEnabled: true,
  initialMcaStatus: {
    ...merchantCenterAccountNotConnected,
    claimError: WebsiteClaimErrorReason.LinkingFailed,
  },
};

export const EnabledDisapproved:any = Template.bind({});
EnabledDisapproved.args = {
  isEnabled: true,
  initialMcaStatus: {
    ...merchantCenterAccountConnected,
    claimError: WebsiteClaimErrorReason.Disapproved,
  },
};
