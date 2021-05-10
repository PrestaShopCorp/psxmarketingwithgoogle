import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'

export default {
  title: 'Merchant Center Account/Card',
  component: MerchantCenterAccountCard,
  argTypes: {
    error: {
      control: {
        type: 'select',
        options: [null, 'disapproved', 'expiring', 'pending', 'overwrite'],
      }
    }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountCard },
  template: '<MerchantCenterAccountCard v-bind="$props" @selectMerchantCenterAccount="fakeConnection" />',
  methods: {
    fakeConnection: (component)=> {
      component.$data.websiteVerification = 'checking';
      component.$data.mcaStatus = "active";
      setTimeout(() => {
        component.$data.websiteVerification = "doneAlert";
        component.$data.mcaConfigured = true;
        setTimeout(() => {
          component.$data.websiteVerification = "done";
        }, 2000);
      }, 2000);
    }
  }
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  error: null,
};

export const EnabledNotConnected:any = Template.bind({});
EnabledNotConnected.args = {
  isEnabled: true,
  error: null,
};
