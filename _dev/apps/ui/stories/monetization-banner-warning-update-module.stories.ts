import MonetizatizationBannerWarningUpdateModule from '../src/components/monetization/monetization-banner-warning-update-module.vue';

export default {
  title: 'Onboarding/Banners',
  component: MonetizatizationBannerWarningUpdateModule,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {MonetizatizationBannerWarningUpdateModule},
  template:
    '<div><MonetizatizationBannerWarningUpdateModule v-bind="$props" /></div>',
});

export const UpdateModule: any = Template.bind({});
UpdateModule.args = {
  loading: false,
};
