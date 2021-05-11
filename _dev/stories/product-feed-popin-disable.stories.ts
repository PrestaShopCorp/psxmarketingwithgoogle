import ProductFeedPopinDisable from '../src/components/product-feed/product-feed-popin-disable.vue'
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Product Feed/Popins/Disable',
  component: ProductFeedPopinDisable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedPopinDisable },
  template: `
    <div>
      <ProductFeedPopinDisable v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
  },
});

export const Disable:any = Template.bind({});
Disable.args = {
  visible: true,
};
