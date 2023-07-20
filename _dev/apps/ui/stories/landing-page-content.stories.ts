import LandingPageContent from '../src/components/landing-page/landing-page-content.vue'

export default {
  title: 'LandingPage/Components/Content',
  component: LandingPageContent,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LandingPageContent },
  template: '<b-card no-body><div class="ps_gs-landingpage"><LandingPageContent v-bind="$props" /></div></b-card>',
});

export const Content:any = Template.bind({});
Content.args = {
  contentImage: 'Google-Commercial-img.png',
  contentTitle: 'Connect your store to Google Merchant Center',
  contentText: 'Connecting your store to Google Merchant Center allows you to upload store and product data to Google. Your products will automatically sync to make relevant information available for free listings, Google Ads, and other Google services.',
  contentFooter: 'You can create a new [Merchant Center account](//tartiflette.com){:target=\"_blank\"} or link an existing account. Note that you’ll need to meet the Merchant Center eligibility requirements in order to connect your store.'
};
