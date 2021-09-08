import SmartShoppingCampaignCreation from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue'
import {initialStateApp} from '../.storybook/mock/state-app';

export default {
  title: 'Smart Shopping Campaign/Creation',
  component: SmartShoppingCampaignCreation,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreation },
  template: `
    <div>
      <SmartShoppingCampaignCreation v-bind="$props" />
    </div>
  `,
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
  }
});

export const Creation:any = Template.bind({});
Creation.args = {
};
