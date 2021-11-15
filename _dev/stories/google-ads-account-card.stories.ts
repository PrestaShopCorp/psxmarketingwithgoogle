import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue';
import GoogleAdsAccountPopinDisconnect from '../src/components/google-ads-account/google-ads-account-popin-disconnect.vue';
import {googleAdsNotChosen, googleAdsAccountChosen, googleAdsAccountChosenisTestAccount} from '../.storybook/mock/google-ads';
import {GoogleAdsErrorReason} from '../src/store/modules/google-ads/state'
export default {
  title: 'Google Ads Account/Card',
  component: GoogleAdsAccountCard,
  parameters: {
    jest: ['google-ads-account-card.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountCard, GoogleAdsAccountPopinDisconnect },
  template: `
    <div>
      <GoogleAdsAccountCard
        ref="googleAdsAccount"
        v-bind="$props"
        @selectGoogleAdsAccount="fakeConnection"
        @disconnectionGoogleAdsAccount="onGoogleAdsAccountDissociationRequest"
      />
      <GoogleAdsAccountPopinDisconnect
        ref="GoogleAdsAccountPopinDisconnect"
      />
    </div>
  `,
  beforeMount: args.beforeMount,

  methods: {
    fakeConnection: function(this: any) {
      this.$refs.googleAdsAccount.$data.googleAdsAccountConfigured = true;
    },
    onGoogleAdsAccountDissociationRequest() {
      // @ts-ignore
      this.$bvModal.show(
        // @ts-ignore
        this.$refs.GoogleAdsAccountPopinDisconnect.$refs.modal.id,
      );
    },
  },

});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
  },
};

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
  },
};


export const EnabledSpinner:any = Template.bind({});
EnabledSpinner.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
    this.$store.state.googleAds.list = null;
  },

};

export const EnabledButNoAccount:any = Template.bind({});
EnabledButNoAccount.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
    this.$store.state.googleAds.list = [];
  }
};

export const EnabledConnected:any = Template.bind({});
EnabledConnected.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);``
  },
}

export const CantConnect:any = Template.bind({});
CantConnect.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
    this.$store.state.googleAds.status = GoogleAdsErrorReason.CantConnect;
  }
};

export const Suspended:any = Template.bind({});
Suspended.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = GoogleAdsErrorReason.Suspended;
  }
};
export const NeedToAcceptInvitation:any = Template.bind({});
NeedToAcceptInvitation.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = GoogleAdsErrorReason.NeedValidationFromEmail;
  }
};

export const NeedRefreshAfterInvitation:any = Template.bind({});
NeedRefreshAfterInvitation.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = GoogleAdsErrorReason.NeedRefreshAfterInvitationLink;
  }
};
export const BillingSettingsMissing:any = Template.bind({});
BillingSettingsMissing.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = GoogleAdsErrorReason.BillingSettingsMissing;
  }
};

export const NeedRefreshAfterBilling:any = Template.bind({});
NeedRefreshAfterBilling.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = GoogleAdsErrorReason.NeedRefreshAfterBilling;
  }
};

export const TestAccount:any = Template.bind({});
TestAccount.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosenisTestAccount);
  }
};
export const Canceled:any = Template.bind({});
Canceled.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = GoogleAdsErrorReason.Cancelled;
  }
};
