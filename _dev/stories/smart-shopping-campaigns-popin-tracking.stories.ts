import SSCPopinActivateTracking from '../src/components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Smart Shopping Campaign/Popins',
    component: SSCPopinActivateTracking,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SSCPopinActivateTracking },
  template: `
    <div>
      <SSCPopinActivateTracking v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});


export const Activate:any = Template.bind({});
Activate.args = {
  visible: true,
};



