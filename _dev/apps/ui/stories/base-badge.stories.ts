export default {
  title: 'Basic Components/Badges',
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { },
  template: `
    <div>
      <b-badge variant="primary">Primary</b-badge>
      <b-badge variant="secondary">Secondary</b-badge>
      <b-badge variant="success">Success</b-badge>
      <b-badge variant="danger">Danger</b-badge>
      <b-badge variant="warning">Warning</b-badge>
      <b-badge variant="info">Info</b-badge>
      <b-badge variant="light">Light</b-badge>
      <b-badge variant="dark">Dark</b-badge>
    </div>
  `,
});

export const Basics:any = Template.bind({});
Basics.args = {}
