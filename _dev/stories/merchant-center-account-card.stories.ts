import MerchantCenterAccountCard from '@/components/merchant-center-account/merchant-center-account-card.vue';
import MerchantCenterAccountPopinDisconnect from '@/components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
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
      {},
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, args.initialMcaStatus);
  },
  mounted: args.mounted,
  methods: {
    fakeConnection(selectedAccount) {
      // @ts-ignore
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT', {selectedAccount, correlationId: ''});
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

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  initialMcaStatus: merchantCenterAccountNotConnected,
  mounted: function(this: any) {
    this.$store.state.accounts.googleAccount.details.email = "jean.peuplu@prestashop.com"
  }
};

export const EnabledSpinner:any = Template.bind({});
EnabledSpinner.args = {
  isEnabled: true,
  initialMcaStatus: merchantCenterAccountNotConnected,
  mounted: function(this: any) {
    // This is not the correct state to show spinner but it works...
    this.$store.state.accounts.googleAccount.mcaSelectionOptions = null
  }
};


export const EnabledButNoAccount:any = Template.bind({});
EnabledButNoAccount.args = {
  isEnabled: true,
  initialMcaStatus: merchantCenterAccountNotConnected,
  mounted: function(this: any) {
    this.$store.state.accounts.googleAccount.mcaSelectionOptions = []
  }
};

export const EnabledLinkingFailed:any = Template.bind({});
EnabledLinkingFailed.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountNotConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.LinkingFailed,
    }
  ),
};

export const Connected:any = Template.bind({});
Connected.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({}, merchantCenterAccountConnected),
};

export const ShopInfoMissing:any = Template.bind({});
ShopInfoMissing.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.ShopInfoMissing,
    },
  )
};

export const OverwriteNeeded:any = Template.bind({});
OverwriteNeeded.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.OverwriteNeeded,
    },
  ),
};

export const OverwriteNeededWithManualAction:any = Template.bind({});
OverwriteNeededWithManualAction.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.OverwriteNeededWithManualAction,
    },
  ),
};

export const AccountValidationFailed:any = Template.bind({});
AccountValidationFailed.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.AccountValidationFailed,
    },
  ),
};

export const Suspended:any = Template.bind({});
Suspended.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      isSuspended: {
        status: true,
        issues: [
          {
            id: 'editorial_and_professional_standards_destination_url_down_policy',
            title:
              'Account suspended due to policy violation: landing page not working',
            country: 'US',
            severity: 'critical',
            documentation:
              'https://google.com/first-link',
          },
          {
            id: 'editorial_and_professional_standards_destination_url_down_policy',
            title:
              'Account suspended due to policy violation: Oh no',
            country: 'US',
            severity: 'critical',
            documentation:
              'https://google.com/second-link',
          },
        ]
      },
    },
  ),
};

export const UnlinkFailed:any = Template.bind({});
UnlinkFailed.args = {
  isEnabled: true,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.UnlinkFailed,
    },
  ),
};
