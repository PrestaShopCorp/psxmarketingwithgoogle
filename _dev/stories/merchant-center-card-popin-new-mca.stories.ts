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

export const NewMcaStepOne:any = Template.bind({});
NewMcaStepOne.args = {
  visible: true,
  infosWebsiteURL: 'maysonroyer.com',
  infosStoreName: 'Maison Royer',
  infosBusinessLocation: 'France',
  infosBusinessAddress: 'La Morelière - 85500 Les Herbiers',
  infosBusinessPhone: '+33 2 51 92 04 25',
  stepActive: 1,
};

export const NewMcaStepTwo:any = Template.bind({});
NewMcaStepTwo.args = {
  visible: true,
  infosWebsiteURL: 'maysonroyer.com',
  infosStoreName: 'Maison Royer',
  infosBusinessLocation: 'France',
  infosBusinessAddress: 'La Morelière - 85500 Les Herbiers',
  infosBusinessPhone: '+33 2 51 92 04 25',
  stepActive: 2,
};
