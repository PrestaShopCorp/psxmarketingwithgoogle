import MerchantCenterAccountPopinAccountIssues from '@/components/merchant-center-account/issues/merchant-center-account-popin-account-issues.vue';
import { merchantCenterAccountSuspended } from '@/../.storybook/mock/merchant-center-account';

export default {
  title: 'Merchant Center Account/Popins',
  component: MerchantCenterAccountPopinAccountIssues,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountPopinAccountIssues },
  template: `
    <div>
      <MerchantCenterAccountPopinAccountIssues visible v-bind="$props" />
    </div>
  `,
});

export const AccountIssues:any = Template.bind({});
AccountIssues.args = {
  issues: merchantCenterAccountSuspended.accountIssues,
};
