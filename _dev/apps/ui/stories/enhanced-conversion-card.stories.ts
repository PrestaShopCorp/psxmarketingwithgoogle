import cloneDeep from 'lodash.clonedeep';
import {rest} from 'msw';
import EnhancedConversionsCard from '@/components/enhanced-conversions/enhanced-conversions-card.vue';
import {State as CampaignsState} from '@/store/modules/campaigns/state';
import {State as GoogleAdsState} from '@/store/modules/google-ads/state';
import { googleAdsAccountChosen, googleAdsAccountChosenWithSignedTos } from '@/../.storybook/mock/google-ads';
import NotificationPanel from '@/components/enhanced-conversions/notification-panel.vue';
export default {
  title: 'Enhanced Conversions/Card',
  component: EnhancedConversionsCard
};

const componentMsw = {
  handlers: [
    rest.post('/', (req, res, ctx) => {
      const payload = req.body.action;

      if (payload === 'setEnhancedConversions') {
        return res(
          ctx.json({
            success: true
          }),
        );
      }
      return null;
    }),
  ],
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    EnhancedConversionsCard,
    NotificationPanel,
  },
  template: `
    <div>
      <notification-panel />
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
Default.parameters = {
  msw: componentMsw,
};

export const WithTosSigned:any = Template.bind({});
WithTosSigned.args = {
  beforeMount: function(this: any) {
    (this.$store.state.campaigns as CampaignsState).trackingFeature.enhanced = false;
    (this.$store.state.googleAds as GoogleAdsState) = cloneDeep(googleAdsAccountChosenWithSignedTos);
  },
}
WithTosSigned.parameters = {
  msw: componentMsw,
};
