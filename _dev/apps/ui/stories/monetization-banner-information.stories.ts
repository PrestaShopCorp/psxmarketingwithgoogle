import MonetizatizationBannerInformation from '../src/components/monetization/monetization-banner-information.vue';

export default {
  title: 'Onboarding/Banner',
  component: MonetizatizationBannerInformation,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {MonetizatizationBannerInformation},
  template:
    '<MonetizatizationBannerInformation v-bind="$props" />',
});

export const BannerInformation: any = Template.bind({});
BannerInformation.args = {};
