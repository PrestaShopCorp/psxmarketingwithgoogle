import {BAlert} from 'bootstrap-vue';

export default {
  title: 'Basic Components/Alerts',
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    BAlert,
  },
  template: `
    <div>
      <b-alert show variant="success">Success Alert</b-alert>
      <b-alert show variant="danger">Danger Alert</b-alert>
      <b-alert show variant="warning">Warning Alert</b-alert>
      <b-alert show variant="info">Info Alert</b-alert>
    </div>
  `,
});

export const Basics:any = Template.bind({});
Basics.args = {}

