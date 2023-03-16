import UserNotConnectedToBoPopin from '../src/components/commons/user-not-connected-to-bo-popin.vue';

export default {
  title: 'Onboarding/Popins',
  component: UserNotConnectedToBoPopin,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { UserNotConnectedToBoPopin },
  template: `
    <div>
      <UserNotConnectedToBoPopin v-bind="$props" />
    </div>
  `,
});

export const DisconnectedFromBo:any = Template.bind({});
DisconnectedFromBo.args = {
  visible: true,
  countdown: 15,
};
