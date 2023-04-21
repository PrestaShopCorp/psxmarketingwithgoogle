import App from '@/App.vue';

export default {
  title: 'Whole application/Overview',
  component: App
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { App },
  template: `
    <div>
      <App />
    </div>
  `,
});

export const Overview:any = Template.bind({});
Overview.args = {}
