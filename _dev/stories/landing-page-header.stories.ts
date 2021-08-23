import LandingPageHeader from '../src/components/landing-page/landing-page-header.vue'

export default {
  title: 'LandingPage/Components/Header',
  component: LandingPageHeader,
  parameters: {
    jest: ['landing-page-header.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPageHeader },
  template: '<b-card no-body><div class="ps_gs-landingpage"><LandingPageHeader v-bind="$props" /></div></b-card>',
});

export const Header:any = Template.bind({});
Header.args = {};
