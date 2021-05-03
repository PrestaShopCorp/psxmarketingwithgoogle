import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue'

export default {
  title: 'Google Ads Account/Card',
  component: GoogleAdsAccountCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountCard },
  template: '<GoogleAdsAccountCard v-bind="$props" @selectGoogleAdsAccount="fakeConnection"/>',
  methods: {
    fakeConnection: (component)=> {
      component.$data.googleAdsAccountConfigured = true;
    }
  }
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  isConnected: false,
};

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  isEnabled: true,
  isConnected: false,
};

export const Connected:any = Template.bind({});
Connected.args = {
  isEnabled: true,
  isConnected: true,
};
