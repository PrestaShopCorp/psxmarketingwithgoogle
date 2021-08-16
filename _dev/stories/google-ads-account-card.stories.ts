import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue';
import GoogleAdsAccountPopinDisconnect from '../src/components/google-ads-account/google-ads-account-popin-disconnect.vue';
import {googleAdsNotChosen, googleAdsAccountChosen} from '../.storybook/mock/google-ads';

export default {
  title: 'Google Ads Account/Card',
  component: GoogleAdsAccountCard,
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
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
  },
};

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
  },
};


export const EnabledSpinner:any = Template.bind({});
EnabledSpinner.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
    this.$store.state.googleAds.list = null;
  },
  
};

export const EnabledButNoAccount:any = Template.bind({});
EnabledButNoAccount.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
    this.$store.state.googleAds.list = [];
  }
};

export const EnabledConnected:any = Template.bind({});
EnabledConnected.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);``
  },
}

export const CantConnect:any = Template.bind({});
CantConnect.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsNotChosen);
    this.$store.state.googleAds.status = 'CantConnect';
  }
};

export const Suspended:any = Template.bind({});
Suspended.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = 'Suspended';
  }
};

export const BillingSettingsMissing:any = Template.bind({});
BillingSettingsMissing.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = 'BillingSettingsMissing';
  }
};

export const NeedRefreshAfterBilling:any = Template.bind({});
NeedRefreshAfterBilling.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = 'NeedRefreshAfterBilling';
  }
};

export const Canceled:any = Template.bind({});
Canceled.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.googleAds.status = 'Cancelled';
  }
};
