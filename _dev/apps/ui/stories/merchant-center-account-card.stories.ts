import MerchantCenterAccountCard from '@/components/merchant-center-account/merchant-center-account-card.vue';
import MerchantCenterAccountPopinDisconnect from '@/components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import {initialStateApp, stateWithMaintenanceModeOn} from '../.storybook/mock/state-app';
import {googleAccountConnected} from '../.storybook/mock/google-account';
import {
  merchantCenterAccountNotConnected,
  merchantCenterAccountConnected,
  merchantCenterNewGmcNotListed,
} from '../.storybook/mock/merchant-center-account';
import {WebsiteClaimErrorReason} from '../src/store/modules/accounts/state';
import {rest} from 'msw';

const getWebsiteRequirementStatusRouteObject = {
  msw: {
    handlers: [
      rest.post('/', (req: any, res, ctx) => {
        const payload = req.body.action;
        if (payload === 'getWebsiteRequirementStatus') {
          return res(
            ctx.json({
              "requirements": [
                "shoppingAdsPolicies",
                "secureCheckoutProcess",
                "accurateContactInformation",
                "billingTerms",
                "completeCheckoutProcess",
                "returnPolicy"
              ]
            })
          );
        };
      }),
    ],
  },
};

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
  parameters: {
    jest: ['merchant-center-account-card.spec.ts'],
    ...getWebsiteRequirementStatusRouteObject,
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
  loading: false,
  initialMcaStatus: Object.assign({}, merchantCenterAccountNotConnected),
};

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({}, merchantCenterAccountNotConnected),
  mounted: function(this: any) {
    this.$store.state.accounts.googleAccount.details.email = "jean.peuplu@prestashop.com"
  }
};

export const EnabledSpinner:any = Template.bind({});
EnabledSpinner.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({}, merchantCenterAccountNotConnected),
  mounted: function(this: any) {
    // This is not the correct state to show spinner but it works...
    this.$store.state.accounts.googleAccount.mcaSelectionOptions = null
  }
};


export const EnabledButNoAccount:any = Template.bind({});
EnabledButNoAccount.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({}, merchantCenterAccountNotConnected),
  mounted: function(this: any) {
    this.$store.state.accounts.googleAccount.mcaSelectionOptions = [];
  }
};

export const EnabledWithOneAccountFromModule:any = Template.bind({});
EnabledWithOneAccountFromModule.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountNotConnected,
    {
      aggregatorId: '123456'
    }
  ),
};

export const EnabledLinkingFailed:any = Template.bind({});
EnabledLinkingFailed.args = {
  isEnabled: true,
  loading: false,
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
  loading: false,
  initialMcaStatus: Object.assign({}, merchantCenterAccountConnected),
};

export const ConnectedButApiFails:any = Template.bind({});
ConnectedButApiFails.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.LinkingFailed,
    }
  ),
};

export const ShopInfoMissing:any = Template.bind({});
ShopInfoMissing.args = {
  isEnabled: true,
  loading: false,
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
  loading: false,
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
  loading: false,
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
  loading: false,
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
  loading: false,
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
  loading: false,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.UnlinkFailed,
    },
  ),
};

export const newGmcNotListed:any = Template.bind({});
newGmcNotListed.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({},
    merchantCenterNewGmcNotListed
  ),
};

export const MaintenanceModeDetected:any = Template.bind({});
MaintenanceModeDetected.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({}, merchantCenterAccountNotConnected),
  mounted (this: any) {
    this.$store.state.app = Object.assign(
      {},
      this.$store.state.app,
      stateWithMaintenanceModeOn
    );
  },
};

export const phoneVerificationNeeded:any = Template.bind({});
phoneVerificationNeeded.args = {
  isEnabled: true,
  loading: false,
  initialMcaStatus: Object.assign({},
    merchantCenterAccountConnected,
    {
      gmcStatus: WebsiteClaimErrorReason.PhoneVerificationNeeded,
    },
  ),
};
