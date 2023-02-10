import TipsAndTricksCard from '@/components/commons/tips-and-tricks-card.vue'

export default {
  title: 'Basic Components/Tips & Tricks',
  component: TipsAndTricksCard
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TipsAndTricksCard },
  template: `
    <div>
      <TipsAndTricksCard v-bind="$props"/>
    </div>
  `,
});

export const Basic:any = Template.bind({});
Basic.args = {
  content: `It is generally recommended to start with a
  **minimum budget of {Amount} {currency} per day for your daily ad spend**.
  This allows you to reach a larger audience & potentially see better
  results.`,
}

export const WithReadMore:any = Template.bind({});
WithReadMore.args = {
  content: `It is generally recommended to start with a
  **minimum budget of {Amount} {currency} per day for your daily ad spend**.
  This allows you to reach a larger audience & potentially see better
  results.`,
  readMore: `This recommended minimum budget will allow you to test the effectiveness
  of your ads and make adjustments as needed. Of course, every business is
  different, and the actual budget that is best for you may vary depending
  on your specific goals and target audience. We recommend experimenting
  with different budgets to determine what works best for your business.`,
}
