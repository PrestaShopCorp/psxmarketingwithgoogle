import SmartShoppingCampaignCreation from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads.js';
import {campaignWithUnhandledFilters} from '../.storybook/mock/smart-shopping-campaigns';
import {rest} from 'msw'

export default {
  title: 'Smart Shopping Campaign/Creation',
  component: SmartShoppingCampaignCreation,
  parameters: {
    msw: {
      handlers: [
        rest.get('/shopping-campaigns/dimensions/filters', (req, res, ctx) => {
          return res(
            ctx.json({
              "categories": [
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~1",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "1",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Animaux et articles pour animaux de compagnie"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~8",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "8",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Arts et loisirs"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~111",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "111",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Entreprise et industrie"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~141",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "141",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Appareils photo, caméras et instruments d'optique"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~166",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "166",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Vêtements et accessoires"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~222",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "222",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Appareils électroniques"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~412",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "412",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Alimentation, boissons et tabac"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~436",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "436",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Meubles"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~469",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "469",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Santé et beauté"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~536",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "536",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Maison et jardin"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~537",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "537",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Bébés et tout-petits"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~632",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "632",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Quincaillerie"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~772",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "772",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Adulte"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~783",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "783",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Médias"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~888",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "888",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Véhicules et accessoires"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~922",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "922",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Fournitures de bureau"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~988",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "988",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Équipements sportifs"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~1239",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "1239",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Jeux et jouets"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~2092",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "2092",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Logiciels"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~5181",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "5181",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Bagages et maroquinerie"
                },
                {
                  "resourceName": "productBiddingCategoryConstants/FR~LEVEL1~5605",
                  "level": "LEVEL1",
                  "status": "ACTIVE",
                  "id": "5605",
                  "countryCode": "FR",
                  "languageCode": "fr",
                  "localizedName": "Offices religieux et cérémonies"
                }
              ],
              "brands": [],
              "products": []
            }),
          );
        }),
      ],
    },
  },
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
    this.$store.state.app.psxMtgWithGoogleDefaultShopCountry = 'EN';
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
  beforeMount: args.beforeMount,
  mounted: args.mounted,
});

export const Creation:any = Template.bind({});
Creation.args = {
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
    this.$store.state.productFeed.validationSummary.activeItems = 2;
  },
};

export const CreationWithoutProducts:any = Template.bind({});
CreationWithoutProducts.args = {
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
    this.$store.state.productFeed.validationSummary.activeItems = 0;
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
    this.$store.state.productFeed.validationSummary.activeItems = 2;
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
    this.$store.state.productFeed.validationSummary.activeItems = 2;
    this.$refs.sscCreation.$data = Object.assign(
      this.$refs.sscCreation.$data,
      campaignWithUnhandledFilters,
    );
  },
};

