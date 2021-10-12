import MerchantCenterAccountPopinWebsiteRequirements from '../src/components/merchant-center-account/merchant-center-account-popin-website-requirements.vue'
import {
  merchantCenterAccountCreation,
  merchantCenterAccountWithErrors,
} from '../.storybook/mock/merchant-center-account';
import {initialStateApp} from '../.storybook/mock/state-app';

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
  beforeCreate(this: any) {
    this.$store.state.app = Object.assign(
      {},
      // this.$store.state.app,
      initialStateApp,
      {psxMktgWithGoogleStoreSettingsUrl: 'https://www.perdu.com'}
    );
  },
  beforeMount: args.beforeMount,
  mounted: args.mounted,
});

export const NewMcaStepRequirements:any = Template.bind({});
NewMcaStepRequirements.args = {
  visible: true,
  stepActive: 1,
  newMca: true,
};

export const NewMcaStepStoreInfo:any = Template.bind({});
NewMcaStepStoreInfo.args = {
  visible: true,
  stepActive: 2,
  newMca: true,
  beforeMount(this : any) {
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountCreation);
  }
};

export const NewMcaStepStoreInfoWithErrors:any = Template.bind({});
NewMcaStepStoreInfoWithErrors.args = {
  visible: true,
  stepActive: 2,
  newMca: true,
  mounted(this : any) {
    setTimeout(() => {
      this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountWithErrors);
    }, 2000);
  }
};

export const CheckRequirements:any = Template.bind({});
CheckRequirements.args = {
  visible: true,
  newMca: false,
};
