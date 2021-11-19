import SmartShoppingCampaignCreationFilterPopin from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation-filter-popin.vue';
import {initialStateApp} from '../.storybook/mock/state-app';
import {availableFilters} from '../.storybook/mock/smart-shopping-campaigns';

export default {
  title: 'Smart Shopping Campaign/Popins/Select Filters',
  component: SmartShoppingCampaignCreationFilterPopin,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreationFilterPopin },
  template: `
    <div>
      <SmartShoppingCampaignCreationFilterPopin v-bind="$props" />
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
