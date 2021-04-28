import GoogleAccountPopinDisconnect from '../src/components/google-account/google-account-popin-disconnect.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'

export default {
  title: 'Google Account/Popins/Disconnect',
  component: GoogleAccountPopinDisconnect, OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAccountPopinDisconnect, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <GoogleAccountPopinDisconnect v-bind="$props" />
    </div>
  `,
});

export const PopinDisconnect:any = Template.bind({});
PopinDisconnect.args = {
  visible: true,
};
