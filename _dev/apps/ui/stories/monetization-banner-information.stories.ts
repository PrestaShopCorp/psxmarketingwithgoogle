import MonetizatizationBannerInformation from '../src/components/monetization/monetization-banner-information.vue';

export default {
  title: 'Onboarding/Banners',
  component: MonetizatizationBannerInformation,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {MonetizatizationBannerInformation},
  template:
    '<MonetizatizationBannerInformation v-bind="$props" />',
});

export const MonetizationInformation: any = Template.bind({});
MonetizationInformation.args = {};
