import MonetizatizationBannerWarningUpdateModule from '../src/components/monetization/monetization-banner-warning-update-module.vue';

export default {
  title: 'Onboarding/Banner',
  component: MonetizatizationBannerWarningUpdateModule,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {MonetizatizationBannerWarningUpdateModule},
  template:
    '<div><MonetizatizationBannerWarningUpdateModule v-bind="$props" /></div>',
});

export const BannerUpdateModule: any = Template.bind({});
BannerUpdateModule.args = {
  loading: false,
};
