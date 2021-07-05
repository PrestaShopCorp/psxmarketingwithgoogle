import MerchantCenterAccountPopinWebsiteRequirements from '../src/components/merchant-center-account/merchant-center-account-popin-website-requirements.vue'
import {merchantCenterAccountCreation} from '../.storybook/mock/merchant-center-account';

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
  beforeMount(this: any) {
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountCreation;
    console.log(this.$store.state);
  },
});

export const NewMcaStepOne:any = Template.bind({});
NewMcaStepOne.args = {
  visible: true,
  stepActive: 1,
  newMca: true,
};

export const NewMcaStepTwo:any = Template.bind({});
NewMcaStepTwo.args = {
  visible: true,
  stepActive: 2,
  newMca: true,
};

export const CheckRequirements:any = Template.bind({});
CheckRequirements.args = {
  visible: true,
  newMca: false,
};
