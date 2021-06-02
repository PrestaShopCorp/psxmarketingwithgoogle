import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue'

export default {
  title: 'Google Ads Account/Card',
  component: GoogleAdsAccountCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountCard },
  template: '<GoogleAdsAccountCard ref="googleAdsAccount" v-bind="$props" @selectGoogleAdsAccount="fakeConnection"/>',
  methods: {
    fakeConnection: function(this: any) {
      this.$refs.googleAdsAccount.$data.googleAdsAccountConfigured = true;
    },
  },
  mounted(this: any) {
    if (this.$refs.googleAdsAccount.$props.isConnected === true) {
      this.$refs.googleAdsAccount.$data.googleAdsAccountConfigured = true;
      this.$refs.googleAdsAccount.$data.selected = '987-654-3210'
    };
  },
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  isConnected: false,
};

export const EnabledNotConnected:any = Template.bind({});
EnabledNotConnected.args = {
  isEnabled: true,
  isConnected: false,
};

export const EnabledConnected:any = Template.bind({});
EnabledConnected.args = {
  isEnabled: true,
  isConnected: true,
};
