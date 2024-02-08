import DebugPage from '@/views/debug-page.vue';

export default {
    title: 'Debug Page/Debug Page View',
    component: DebugPage,
};

const Template = (args: any, {argTypes}: any) => ({
  props: Object.keys(argTypes),
  components: {DebugPage},
  template: '<debug-page />',
});

export const DebugPageView: any = Template.bind({});
DebugPageView.args = {
};
