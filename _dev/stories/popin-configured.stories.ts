import PopinConfigured from '../src/components/commons/popin-configured.vue'

export default {
  title: 'Basic Components/Popin When Configured',
  component: PopinConfigured,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PopinConfigured },
  template: `
  <div>
      <PopinConfigured/>
      </div>
  `,
});

export const PopinWhenConfigured:any = Template.bind({});
PopinWhenConfigured.args = {
  visible: true,
}
