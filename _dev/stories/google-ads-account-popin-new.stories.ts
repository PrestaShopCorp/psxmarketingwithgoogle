import GoogleAdsAccountPopinNew from '../src/components/google-ads-account/google-ads-account-popin-new.vue'

export default {
  title: 'Google Ads Account/Popins',
  component: GoogleAdsAccountPopinNew,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAdsAccountPopinNew },
  template: `
    <div>
      <GoogleAdsAccountPopinNew
        ref="googleAdsAccount"
        v-bind="$props"
      />
    </div>
  `,
});

export const StepOne:any = Template.bind({});
StepOne.args = {
  visible: true,
};

export const StepTwo:any = Template.bind({});
StepTwo.args = {
  visible: true,
  stepActive: 2,
};

export const StepThree:any = Template.bind({});
StepThree.args = {
  visible: true,
  stepActive: 3,
};
