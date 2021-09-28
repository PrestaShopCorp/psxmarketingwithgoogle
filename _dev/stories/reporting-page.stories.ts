import Reporting from '../src/views/reporting-page.vue'
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';

export default {
  title: 'Reporting/Reporting View',
  component: Reporting,
  parameters: {
    jest: ['landing-page.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Reporting },
  template: '<Reporting />',
  beforeMount(this: any) {
    this.$store.dispatch = () => { return Promise.resolve('coucou') };
    args.beforeMount;
  }
});

export const ReportingView:any = Template.bind({});
ReportingView.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
};
