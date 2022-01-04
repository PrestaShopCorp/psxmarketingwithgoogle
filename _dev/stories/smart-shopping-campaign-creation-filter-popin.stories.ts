import SmartShoppingCampaignCreationPopin from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation-filter-popin/smart-shopping-campaign-creation-popin.vue';
import {initialStateApp} from '../.storybook/mock/state-app';
import {availableFilters} from '../.storybook/mock/smart-shopping-campaigns';

export default {
  title: 'Smart Shopping Campaign/Popins/Select Filters',
  component: SmartShoppingCampaignCreationPopin,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreationPopin },
  template: `
    <div>
      <SmartShoppingCampaignCreationPopin v-bind="$props" />
    </div>
  `,
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
  },
});

export const SelectFilters:any = Template.bind({});
SelectFilters.args = {
  visible: true,
  availableFilters,
};
