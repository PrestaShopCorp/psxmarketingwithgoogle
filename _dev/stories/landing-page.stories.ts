import LandingPage from '../src/views/landing-page.vue'
import LandingPageHeader from '../src/components/landing-page/landing-page-header.vue'
import LandingPageContent from '../src/components/landing-page/landing-page-content.vue'
import LandingPageFooter from '../src/components/landing-page/landing-page-footer.vue'

export default {
  title: 'LandingPage/LandingPage',
  component: LandingPage,
};

const TemplateView = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPage },
  template: '<LandingPage  />',
});

const TemplateHeader = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPageHeader },
  template: '  <b-card no-body><div class="ps_gs-landingpage"><LandingPageHeader /></div></b-card>',
});

const TemplateContent = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPageContent },
  template: '  <b-card no-body><div class="ps_gs-landingpage"><LandingPageContent /></div></b-card>',
});

const TemplateFooter = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPageFooter },
  template: '  <b-card no-body><div class="ps_gs-landingpage"><LandingPageFooter /></div></b-card>',
});

export const View:any = TemplateView.bind({});
View.args = {};

export const Header:any = TemplateHeader.bind({});
Header.args = {};

export const Content:any = TemplateContent.bind({});
Content.args = {};

export const Footer:any = TemplateFooter.bind({});
Footer.args = {};
