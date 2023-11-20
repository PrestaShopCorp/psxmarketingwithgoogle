import cloneDeep from 'lodash.clonedeep';
import EnhancedConversionsCard from '@/components/enhanced-conversions/enhanced-conversions-card.vue';
import {State as CampaignsState} from '@/store/modules/campaigns/state';

export default {
  title: 'Enhanced Conversions',
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

export const Card:any = Template.bind({});
Card.args = {
  beforeMount: function(this: any) {
    (this.$store.state.campaigns as CampaignsState).trackingFeature.enhanced = false;
  },
}
