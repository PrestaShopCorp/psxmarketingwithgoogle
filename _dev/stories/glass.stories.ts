import GlassScreen from '../src/components/commons/glass.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'

export default {
  title: 'Base/Glass',
  component: GlassScreen, OnboardingPage
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GlassScreen, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <GlassScreen />
    </div>
  `,
});

export const Glass:any = Template.bind({});
Glass.args = {}
