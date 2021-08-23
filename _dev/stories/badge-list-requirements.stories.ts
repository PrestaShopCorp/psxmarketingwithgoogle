import BadgeListRequirements from '../src/components/commons/badge-list-requirements.vue'

export default {
  title: 'Basic Components/Badge List',
  component: BadgeListRequirements,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {BadgeListRequirements},
  template: `
    <BadgeListRequirements v-bind="$props"/>
  `,
});

export const BadgeList:any = Template.bind({});
BadgeList.args = {
  visible: true,
  badges: [
    'productFeed',
    'googleAdsAccount',
  ],
};

BadgeList.parameters = {
  jest: ['badge-list-requirements.spec.ts'],
};
