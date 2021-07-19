import FreeListingPopinEnable from '../src/components/free-listing/free-listing-popin-enable.vue'
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Free Listing/Popins/Enable',
  component: FreeListingPopinEnable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingPopinEnable },
  template: `
    <div>
      <FreeListingPopinEnable v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const Enable:any = Template.bind({});
Enable.args = {
  visible: true,
};
