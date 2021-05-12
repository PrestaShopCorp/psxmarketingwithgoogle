import MerchantCenterAccountPopinNewMca from '../src/components/merchant-center-account/merchant-center-account-popin-new-mca.vue'

export default {
  title: 'Merchant Center Account/Popins/New MCA',
  component: MerchantCenterAccountPopinNewMca,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountPopinNewMca,},
  template: `
    <div>
      <MerchantCenterAccountPopinNewMca v-bind="$props" />
    </div>
  `,
});

export const NewMCA:any = Template.bind({});
NewMCA.args = {
  visible: true,
};
