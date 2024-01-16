import MerchantCenterAccountPopinAccountIssues from '@/components/merchant-center-account/issues/merchant-center-account-popin-account-issues.vue';

export default {
  title: 'Merchant Center Account/Popins/Account errors',
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

export const Default:any = Template.bind({});
Default.args = {
};
