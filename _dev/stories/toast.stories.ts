import PsToast from '../src/components/commons/ps-toast.vue'

export default {
  title: 'Basic Components/Toast',
  component: PsToast,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PsToast },
  template: `
    <div>
      <ps-toast
        variant="success"
        :show="isToastShown"
      >
        Fixed position (top) alert!
      </ps-toast>
    </div>
  `,
});

export const Toast:any = Template.bind({});
Toast.args = {
  isToastShown: 5,
}
