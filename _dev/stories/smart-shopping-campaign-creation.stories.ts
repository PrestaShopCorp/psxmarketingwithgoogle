import SmartShoppingCampaignCreation from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads.js';

export default {
  title: 'Smart Shopping Campaign/Creation',
  component: SmartShoppingCampaignCreation,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreation },
  template: `
    <div>
      <SmartShoppingCampaignCreation v-bind="$props" ref="sscCreation"/>
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
  beforeMount: args.beforeMount,
  mounted: args.mounted,
});

export const Creation:any = Template.bind({});
Creation.args = {
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
  },
};

export const FieldsErrorFeedback:any = Template.bind({});
FieldsErrorFeedback.args = {
  beforeMount(this: any) {
  },
  mounted(this: any) {
    // set name
    this.$refs.sscCreation.$data.campaignName = 'foobar';
    // set invalid budget
    this.$refs.sscCreation.$data.campaignDailyBudget = 'foobar';
    // set name to already exist
    const $ = this;
    setTimeout(function(){
      $.$store.commit('smartShoppingCampaigns/SET_ERROR_CAMPAIGN_NAME_EXISTS', true);
    }, 300);
  },
};
