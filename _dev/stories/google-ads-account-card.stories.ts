import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue'

export default {
  title: 'Google Ads Account/Card',
  component: GoogleAdsAccountCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountCard },
  template: `
    <div>
      <GoogleAdsAccountCard
        ref="googleAdsAccount"
        v-bind="$props"
        @selectGoogleAdsAccount="fakeConnection"/>
    </div>
  `,
  methods: {
    fakeConnection: function(this: any) {
      this.$refs.googleAdsAccount.$data.googleAdsAccountConfigured = true;
    },
  },
  mounted(this: any) {
    if (args.isConnected === true) {
      this.$refs.googleAdsAccount.$data.googleAdsAccountConfigured = true;
      this.$refs.googleAdsAccount.$data.selected = {
        'id': '4150564877',
        'name': 'Lui Corpette',
      }
    };
  },
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
};

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
};

// TODO: todo
export const EnabledSpinner:any = Template.bind({});
EnabledSpinner.args = {
  isEnabled: true,
};

// TODO: todo
export const EnabledButNoAccount:any = Template.bind({});
EnabledButNoAccount.args = {
  isEnabled: true,
};

export const EnabledConnected:any = Template.bind({});
EnabledConnected.args = {
  isEnabled: true,
  isConnected: true,
};

// TODO: todo
export const CantConnect:any = Template.bind({});
CantConnect.args = {
  isEnabled: true,
};

// TODO: todo
export const Suspended:any = Template.bind({});
Suspended.args = {
  isEnabled: true,
};

// TODO: todo
export const BillingSettingsMissing:any = Template.bind({});
BillingSettingsMissing.args = {
  isEnabled: true,
};

// TODO: todo
export const NeedRefreshAfterBilling:any = Template.bind({});
NeedRefreshAfterBilling.args = {
  isEnabled: true,
};

// TODO: todo
export const Canceled:any = Template.bind({});
Canceled.args = {
  isEnabled: true,
};
