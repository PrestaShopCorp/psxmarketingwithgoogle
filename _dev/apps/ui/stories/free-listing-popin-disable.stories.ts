import FreeListingPopinDisable from '../src/components/free-listing/free-listing-popin-disable.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Free Listing/Popins/Disable',
  component: FreeListingPopinDisable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingPopinDisable },
  template: `
    <div>
      <FreeListingPopinDisable v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const Disable:any = Template.bind({});
Disable.args = {
  visible: true,
};
