import LandingPageFooter from '../src/components/landing-page/landing-page-footer.vue'

export default {
  title: 'LandingPage/Components/Footer',
  component: LandingPageFooter,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPageFooter },
  template: '<b-card no-body><div class="ps_gs-landingpage"><LandingPageFooter v-bind="$props" /></div></b-card>',
});

export const Footer:any = Template.bind({});
Footer.args = {};
