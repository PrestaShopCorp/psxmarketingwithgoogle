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

export const Edition:any = Template.bind({});
Edition.args = {
  editMode: true,
  mounted(this: any) {
    this.$refs.sscCreation.$data.campaignName = 'A super name';
    this.$refs.sscCreation.$data.campaignDurationStartDate = '2021-10-30';
    this.$refs.sscCreation.$data.campaignDurationEndDate = '2021-12-30';
    this.$refs.sscCreation.$data.campaignProductsFilter = [];
    this.$refs.sscCreation.$data.campaignDailyBudget = 7;
    this.$refs.sscCreation.$data.campaignIsActive = true;
    this.$refs.sscCreation.$data.campaignId = 'foo';
    this.$refs.sscCreation.$data.targetCountry = this.$options.filters.changeCountriesCodesToNames(
      ['FR'],
    );
  },
};

export const EditionWithUnhandledFilters:any = Template.bind({});
EditionWithUnhandledFilters.args = {
  editMode: true,
  mounted(this: any) {
    this.$refs.sscCreation.$data.campaignName = 'A super name';
    this.$refs.sscCreation.$data.campaignDurationStartDate = '2021-10-30';
    this.$refs.sscCreation.$data.campaignDurationEndDate = '2021-12-30';
    this.$refs.sscCreation.$data.campaignProductsFilter = [];
    this.$refs.sscCreation.$data.campaignDailyBudget = 7;
    this.$refs.sscCreation.$data.campaignIsActive = true;
    this.$refs.sscCreation.$data.campaignId = 'foo';
    this.$refs.sscCreation.$data.targetCountry = this.$options.filters.changeCountriesCodesToNames(
      ['FR'],
    );
    this.$refs.sscCreation.$data.campaignHasNoProductsFilter = false;
    this.$refs.sscCreation.$data.filtersChosen = [
      {
        dimension: 'categories',
        values: ['42'],
      }
    ];
    this.$refs.sscCreation.$data.hasUnhandledFilters = true;
  },
};

