import BannerAds from '../src/components/commons/banner-ads.vue'
import BannerCampaigns from '../src/components/commons/banner-campaigns.vue'

export default {
    title: 'Basic Components/Banners',
  };
  
  const TemplateBannerAds = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {BannerAds},
    template: `
      <div>
        <BannerAds  v-bind="$props" />
      </div>
    `,
    beforeMount: args.beforeMount,
  });
  
  export const AdsAdvertising:any = TemplateBannerAds.bind({});
  AdsAdvertising.args = {

  };
  const TemplateBannerCampaigns = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {BannerCampaigns},
    template: `
      <div>
        <BannerCampaigns/>
      </div>
    `,
    beforeMount: args.beforeMount,
  });
  
  export const AdsCampaigns :any = TemplateBannerCampaigns.bind({});
  AdsCampaigns.args = {

  };
  