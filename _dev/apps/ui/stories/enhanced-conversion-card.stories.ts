import cloneDeep from 'lodash.clonedeep';
import EnhancedConversionsCard from '@/components/enhanced-conversions/enhanced-conversions-card.vue';
import {State as CampaignsState} from '@/store/modules/campaigns/state';
import {State as GoogleAdsState} from '@/store/modules/google-ads/state';
import { googleAdsAccountChosen, googleAdsAccountChosenWithSignedTos } from '@/../.storybook/mock/google-ads';

export default {
  title: 'Enhanced Conversions/Card',
  component: EnhancedConversionsCard
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { EnhancedConversionsCard },
  template: `
    <div>
      <enhanced-conversions-card v-bind="$props" />
    </div>
  `,
  beforeMount: args.beforeMount,
});

export const Default:any = Template.bind({});
Default.args = {
  beforeMount: function(this: any) {
    (this.$store.state.campaigns as CampaignsState).trackingFeature.enhanced = false;
    (this.$store.state.googleAds as GoogleAdsState) = cloneDeep(googleAdsAccountChosen);
  },
}

export const WithTosSigned:any = Template.bind({});
WithTosSigned.args = {
  beforeMount: function(this: any) {
    (this.$store.state.campaigns as CampaignsState).trackingFeature.enhanced = false;
    (this.$store.state.googleAds as GoogleAdsState) = cloneDeep(googleAdsAccountChosenWithSignedTos);
  },
}
