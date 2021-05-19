import MerchantCenterAccountPopinWebsiteRequirements from '../src/components/merchant-center-account/merchant-center-account-popin-website-requirements.vue'

export default {
  title: 'Merchant Center Account/Popins/Website Requirements',
  component: MerchantCenterAccountPopinWebsiteRequirements,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountPopinWebsiteRequirements,},
  template: `
    <div>
      <MerchantCenterAccountPopinWebsiteRequirements v-bind="$props" />
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
  newMca: true,
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
  newMca: true,
};

export const CheckRequirements:any = Template.bind({});
CheckRequirements.args = {
  visible: true,
  infosWebsiteURL: 'maysonroyer.com',
  infosStoreName: 'Maison Royer',
  infosBusinessLocation: 'France',
  infosBusinessAddress: 'La Morelière - 85500 Les Herbiers',
  infosBusinessPhone: '+33 2 51 92 04 25',
  newMca: false,
};
