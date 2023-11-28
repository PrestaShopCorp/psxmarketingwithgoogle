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
        :visible="visible"
        toaster="b-toaster-top-right"
        :no-auto-hide="true"
      >
        <p>
          Success variant.
        </p>
      </ps-toast>
      <ps-toast
        variant="warning"
        :visible="visible"
        toaster="b-toaster-top-right"
        :no-auto-hide="true"
      >
        <p>
          Warning variant.
        </p>
      </ps-toast>
      <ps-toast
        variant="danger"
        :visible="visible"
        toaster="b-toaster-top-right"
        :no-auto-hide="true"
      >
        <p>
          Danger variant.
        </p>
      </ps-toast>
    </div>
  `,
});

export const Toast:any = Template.bind({});
Toast.args = {
  visible: true,
}
